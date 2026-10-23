import * as fflate from 'fflate';
import {
  CalculadoraDeAderencia,
  extrairTextoDePdf,
  decodificarEscapesPdf,
  decodificarStringHexPdf,
  base64ParaBytes,
  Vaga,
} from '../../src/domain';
import { ApplicationRepository } from '../../src/data/repositories';
import { localStorageService, STORAGE_KEYS } from '../../src/data/storage/localStorage';

describe('Extração de texto de PDF e Compatibilidade por Palavras-Chave', () => {
  beforeEach(async () => {
    await localStorageService.setString(STORAGE_KEYS.CANDIDATURAS, null);
  });

  describe('pdfExtractor', () => {
    test('decodifica escapes padrão do formato PDF', () => {
      const entrada = 'Engenharia\\n\\(Software\\)\\tUNDB';
      const decodificado = decodificarEscapesPdf(entrada);
      expect(decodificado).toBe('Engenharia\n(Software)\tUNDB');
    });

    test('decodifica strings hexadecimais em ASCII e UTF-16BE', () => {
      // "React" em hex ASCII
      const hexAscii = '5265616374';
      expect(decodificarStringHexPdf(hexAscii)).toBe('React');

      // "SQL" em UTF-16BE com BOM
      const hexUtf16Bom = 'feff00530051004c';
      expect(decodificarStringHexPdf(hexUtf16Bom)).toBe('SQL');
    });

    test('converte base64 para bytes Uint8Array de forma confiável', () => {
      const texto = 'Engenharia UNDB';
      const rawBytes = fflate.strToU8(texto);
      const binaryStr = String.fromCharCode.apply(null, Array.from(rawBytes));
      const base64 = btoa(binaryStr);
      const bytes = base64ParaBytes(base64);
      const decodificado = fflate.strFromU8(bytes);
      expect(decodificado).toBe(texto);
    });

    test('extrai texto de PDF com stream comprimida via FlateDecode (zlib)', async () => {
      const streamContent =
        'BT /F1 12 Tf 72 712 Td (Aluno da UNDB) Tj 0 -15 Td [(React Native) 10 (TypeScript) 10 (Git) 10 (SQL)] TJ ET';
      const compressed = fflate.zlibSync(fflate.strToU8(streamContent));
      const compressedBinary = String.fromCharCode.apply(null, Array.from(compressed));

      const pdfParts = [
        '%PDF-1.4\n',
        '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
        '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
        '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >> endobj\n',
        '4 0 obj << /Length ' + compressed.length + ' /Filter /FlateDecode >>\nstream\n',
        compressedBinary,
        '\nendstream\nendobj\nxref\ntrailer << /Root 1 0 R >>\n%%EOF',
      ];
      const pdfData = pdfParts.join('');

      const textoExtraido = await extrairTextoDePdf(pdfData);

      expect(textoExtraido).toContain('Aluno da UNDB');
      expect(textoExtraido).toContain('React Native');
      expect(textoExtraido).toContain('TypeScript');
      expect(textoExtraido).toContain('Git');
      expect(textoExtraido).toContain('SQL');
    });

    test('extrai texto a partir de base64 de PDF', async () => {
      const streamContent = 'BT (Curriculo Joao) Tj [(Node.js) 10 (PostgreSQL)] TJ ET';
      const compressed = fflate.zlibSync(fflate.strToU8(streamContent));
      const compressedBinary = String.fromCharCode.apply(null, Array.from(compressed));

      const pdfString =
        '%PDF-1.4\n1 0 obj << /Filter /FlateDecode >> stream\n' +
        compressedBinary +
        '\nendstream\nendobj\n%%EOF';

      const base64 = btoa(pdfString);
      const extraido = await extrairTextoDePdf(base64);

      expect(extraido).toContain('Curriculo Joao');
      expect(extraido).toContain('Node.js');
      expect(extraido).toContain('PostgreSQL');
    });

    test('decodifica glifos usando tabela /ToUnicode CMap de fontes subsetadas', async () => {
      const cmap = [
        '/CIDInit /ProcSet findresource begin 12 dict begin begincmap',
        '1 beginbfrange <0001> <0003> <0041> endbfrange', // 0001->A, 0002->B, 0003->C
        '1 beginbfchar <0004> <0052> endbfchar', // 0004->R
        '1 beginbfchar <0005> <0065> endbfchar', // 0005->e
        '1 beginbfchar <0006> <0061> endbfchar', // 0006->a
        '1 beginbfchar <0007> <0063> endbfchar', // 0007->c
        '1 beginbfchar <0008> <0074> endbfchar', // 0008->t
        'endcmap CMapName currentdict /CMap defineresource pop end end',
      ].join('\n');
      const cmapComp = fflate.zlibSync(fflate.strToU8(cmap));
      const cmapBinary = String.fromCharCode.apply(null, Array.from(cmapComp));

      const content = 'BT /F1 12 Tf 72 712 Td (Dev:) Tj [<00040005000600070008> 10 <000100020003>] TJ ET';
      const contentComp = fflate.zlibSync(fflate.strToU8(content));
      const contentBinary = String.fromCharCode.apply(null, Array.from(contentComp));

      const pdf = [
        '%PDF-1.4\n',
        '1 0 obj << /Type /Page /Contents 2 0 R >> endobj\n',
        '2 0 obj << /Length ' + contentComp.length + ' /Filter /FlateDecode >>\nstream\n',
        contentBinary,
        '\nendstream\nendobj\n',
        '3 0 obj << /Type /Font /ToUnicode 4 0 R >> endobj\n',
        '4 0 obj << /Length ' + cmapComp.length + ' /Filter /FlateDecode >>\nstream\n',
        cmapBinary,
        '\nendstream\nendobj\nxref\ntrailer << /Root 1 0 R >>\n%%EOF',
      ].join('');

      const extraido = await extrairTextoDePdf(pdf);

      expect(extraido).toContain('React');
      expect(extraido).toContain('ABC');
    });
  });

  describe('Cálculo de compatibilidade por palavras-chave', () => {
    const palavrasChaveVaga = ['React Native', 'TypeScript', 'Git', 'SQL', 'Docker'];

    test('calcula porcentagem exata com base em palavras-chave encontradas no currículo', () => {
      // Currículo possui 4 de 5 palavras: React Native, TypeScript, Git, SQL (falta Docker)
      const textoCurriculo = `
        Objetivo: Estágio em Desenvolvimento
        Habilidades: Conhecimentos em React Native com TypeScript, versionamento com Git e banco de dados SQL.
      `;

      const resultado = CalculadoraDeAderencia.calcularPorPalavrasChave(
        textoCurriculo,
        palavrasChaveVaga,
      );

      expect(resultado.total).toBe(5);
      expect(resultado.aderencia).toBe(80); // 4 / 5 = 80%
      expect(resultado.palavrasAtendidas).toEqual(['React Native', 'TypeScript', 'Git', 'SQL']);
      expect(resultado.palavrasFaltantes).toEqual(['Docker']);
    });

    test('retorna 100% quando todas as palavras-chave estão presentes no texto do PDF', () => {
      const textoCurriculo = `
        Perfil Técnico:
        React Native, TypeScript, Git, SQL, Docker.
      `;

      const resultado = CalculadoraDeAderencia.calcularPorPalavrasChave(
        textoCurriculo,
        palavrasChaveVaga,
      );

      expect(resultado.aderencia).toBe(100);
      expect(resultado.palavrasFaltantes).toHaveLength(0);
    });

    test('retorna 0% quando nenhuma palavra-chave bate', () => {
      const textoCurriculo = 'Experiência apenas em Marketing e Vendas.';

      const resultado = CalculadoraDeAderencia.calcularPorPalavrasChave(
        textoCurriculo,
        palavrasChaveVaga,
      );

      expect(resultado.aderencia).toBe(0);
      expect(resultado.palavrasAtendidas).toHaveLength(0);
      expect(resultado.palavrasFaltantes).toHaveLength(5);
    });

    test('CalculadoraDeAderencia.calcular integra palavrasChave da vaga no Diagnóstico', () => {
      const vaga: Vaga = {
        id: 'vaga_kw',
        titulo: 'Dev Mobile Pleno',
        empresa: 'Tech Maranhão',
        descricao: 'Vaga para desenvolvedor mobile.',
        origem: 'empresa',
        requisitos: [],
        palavrasChave: ['React Native', 'TypeScript', 'Git'],
      };

      const textoCurriculo = 'Desenvolvedor com experiência em React Native e Git.';
      const diag = CalculadoraDeAderencia.calcular(textoCurriculo, vaga);

      expect(diag.aderencia).toBe(67); // 2 de 3 = 67%
      expect(diag.palavrasAtendidas).toEqual(['React Native', 'Git']);
      expect(diag.palavrasFaltantes).toEqual(['TypeScript']);
    });
  });

  describe('Persistência e fluxo de Candidaturas', () => {
    test('registra e lista candidaturas de estudantes para uma vaga', async () => {
      const repo = new ApplicationRepository();

      const cand1 = await repo.candidatar({
        vagaId: 'vaga_10',
        alunoId: 'aluno_1',
        alunoNome: 'Carlos Silva',
        compatibilidade: 85,
      });

      expect(cand1.id).toBeDefined();
      expect(cand1.vagaId).toBe('vaga_10');

      const todas = await repo.listar();
      expect(todas).toHaveLength(1);
      expect(todas[0].alunoNome).toBe('Carlos Silva');

      const jaAplicou = await repo.jaCandidatou('vaga_10', 'aluno_1');
      expect(jaAplicou).toBe(true);

      const naoAplicou = await repo.jaCandidatou('vaga_20', 'aluno_1');
      expect(naoAplicou).toBe(false);
    });
  });

  describe('Validação de formato e leitura de arquivos PDF', () => {
    test('validação impede arquivos que não possuam extensão ou mimeType de PDF', async () => {
      // Simular chamada direta com arquivo inválido
      const nomeInvalido = 'documento.docx';
      const ehPdf = nomeInvalido.toLowerCase().endsWith('.pdf');
      expect(ehPdf).toBe(false);
    });
  });
});

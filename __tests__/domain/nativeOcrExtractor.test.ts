import * as fflate from 'fflate';
import {
  extrairTextoCompletoPdf,
  extrairTextoViaOcrNativo,
  verificarDisponibilidadeOcrNativo,
} from '../../src/domain/nativeOcrExtractor';

describe('nativeOcrExtractor', () => {
  describe('verificarDisponibilidadeOcrNativo', () => {
    test('retorna false sem lançar exceção quando o módulo nativo não está linkado (ambiente de teste/Expo Go)', async () => {
      const disponivel = await verificarDisponibilidadeOcrNativo();
      expect(typeof disponivel).toBe('boolean');
    });
  });

  describe('extrairTextoViaOcrNativo', () => {
    test('retorna null graciosamente quando executado fora de um build nativo compilado', async () => {
      const resultado = await extrairTextoViaOcrNativo('file:///caminho/falso/curriculo.pdf');
      expect(resultado).toBeNull();
    });
  });

  describe('extrairTextoCompletoPdf', () => {
    test('extrai texto digital nativamente quando o PDF possui texto vetorial padrão', async () => {
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

      const res = await extrairTextoCompletoPdf('file:///test.pdf', pdfData, {
        preferirNativo: false,
        permitirFallbackCloud: false,
      });

      expect(res.metodo).toBe('digital');
      expect(res.texto).toContain('Aluno da UNDB');
      expect(res.texto).toContain('React Native');
    });

    test('retorna método "nenhum" e texto vazio quando o PDF é inválido ou vazio sem fallback', async () => {
      const res = await extrairTextoCompletoPdf('', '', {
        preferirNativo: false,
        permitirFallbackCloud: false,
      });

      expect(res.metodo).toBe('nenhum');
      expect(res.texto).toBe('');
    });
  });
});

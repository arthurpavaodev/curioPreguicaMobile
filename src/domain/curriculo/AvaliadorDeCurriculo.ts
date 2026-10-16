import { normalizarTexto } from '../competencia/normalizarTexto';
import { SecoesDetectadas } from './Curriculo';

export interface AvaliacaoCurriculo {
  pontosFortes: string[];
  pontosFracos: string[];
  secoesDetectadas: SecoesDetectadas;
  totalPalavras: number;
}

export class AvaliadorDeCurriculo {
  static avaliar(texto: string): AvaliacaoCurriculo {
    if (!texto || !texto.trim()) {
      return {
        pontosFortes: [],
        pontosFracos: ['Currículo vazio. Cole seu currículo para receber uma análise detalhada.'],
        secoesDetectadas: {
          objetivo: false,
          formacao: false,
          projetos: false,
          habilidades: false,
          idiomas: false,
        },
        totalPalavras: 0,
      };
    }

    const n = normalizarTexto(texto);
    const palavras = texto.trim().split(/\s+/).filter(Boolean).length;
    const pontosFortes: string[] = [];
    const pontosFracos: string[] = [];

    // 1. E-mail válido
    const temEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(texto);
    if (temEmail) {
      pontosFortes.push('Há e-mail de contato.');
    } else {
      pontosFracos.push('Inclua um e-mail de contato no topo do currículo.');
    }

    // 2. Links GitHub ou LinkedIn
    const temLinks = /github\.com|linkedin\.com/.test(n);
    if (temLinks) {
      pontosFortes.push('Inclui link de GitHub ou LinkedIn.');
    } else {
      pontosFracos.push('Inclua o link do GitHub ou do LinkedIn, principalmente se tiver projetos.');
    }

    // 3. Seções
    const temObjetivo = /(objetivo|resumo|perfil)/.test(n);
    const temFormacao = /(formacao|educacao|graduacao|bacharelado)/.test(n);
    const temProjetos = /(projeto|experiencia|estagio)/.test(n);
    const temHabilidades = /(habilidades|competencias|tecnologias|skills)/.test(n);
    const temIdiomas = /(idioma|idiomas|ingles|espanhol|linguas)/.test(n);

    if (temObjetivo && temFormacao && temProjetos && temHabilidades) {
      pontosFortes.push(
        'Estrutura completa: objetivo, formação, projetos ou experiência e habilidades.',
      );
    } else {
      if (!temObjetivo) pontosFracos.push('Falta a seção de objetivo.');
      if (!temFormacao) pontosFracos.push('Falta a seção de formação.');
      if (!temProjetos) pontosFracos.push('Falta a seção de projetos ou experiência.');
      if (!temHabilidades) pontosFracos.push('Falta a seção de habilidades.');
    }

    // 4. Tamanho
    if (palavras < 120) {
      pontosFracos.push(
        `Currículo muito curto (${palavras} palavras). Detalhe projetos e o que você fez neles.`,
      );
    } else if (palavras > 700) {
      pontosFracos.push(
        `Currículo longo (${palavras} palavras). O ideal é caber em uma página.`,
      );
    } else {
      pontosFortes.push(`Extensão adequada (${palavras} palavras).`);
    }

    // 5. Resultados com números
    const regexNumeros = /\b\d+\s?(%|usuarios|alunos|colegas|clientes|pessoas|horas|projetos|downloads)/;
    if (regexNumeros.test(n)) {
      pontosFortes.push('Mostra resultados com números.');
    } else {
      pontosFracos.push('Quantifique resultados. Exemplo: "usado por 30 colegas".');
    }

    return {
      pontosFortes,
      pontosFracos,
      secoesDetectadas: {
        objetivo: temObjetivo,
        formacao: temFormacao,
        projetos: temProjetos,
        habilidades: temHabilidades,
        idiomas: temIdiomas,
      },
      totalPalavras: palavras,
    };
  }
}

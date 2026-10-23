import { AvaliacaoCurriculo, Competencia, ItemOrtografico } from './models';
import { detectarCompetencias } from './catalog';
import { escaparRegex, normalizarTexto } from './textNormalizer';

export const PALAVRAS_COM_ACENTO: string[] = [
  'experiência',
  'formação',
  'graduação',
  'técnico',
  'técnica',
  'análise',
  'usuário',
  'usuários',
  'solução',
  'soluções',
  'comunicação',
  'programação',
  'informação',
  'informática',
  'aplicação',
  'aplicações',
  'estágio',
  'período',
  'inglês',
  'lógica',
  'você',
  'também',
  'através',
  'português',
  'organização',
  'responsável',
  'disponível',
  'conclusão',
  'educação',
  'gestão',
  'currículo',
  'excelência',
  'matemática',
  'ágil',
  'básico',
  'intermediário',
  'avançado',
  'são luís',
  'tecnológico',
  'pós-graduação',
  'habilitação',
  'atuação',
  'dedicação',
  'criação',
  'interação',
  'validação',
  'implementação',
  'documentação',
];

export class VerificadorOrtografico {
  static verificar(texto: string): ItemOrtografico[] {
    if (!texto) return [];

    const resultado: ItemOrtografico[] = [];
    const vistas = new Set<string>();
    const textoLower = texto.toLowerCase();

    // 1. Palavras sem acento
    for (const correta of PALAVRAS_COM_ACENTO) {
      const semAcento = normalizarTexto(correta);
      if (correta.toLowerCase() === semAcento) continue;

      const regex = new RegExp(`(?<![\\p{L}\\p{N}])${escaparRegex(semAcento)}(?![\\p{L}\\p{N}])`, 'gu');
      if (regex.test(textoLower) && !vistas.has(semAcento)) {
        vistas.add(semAcento);
        resultado.push({
          errada: semAcento,
          correta,
          tipo: 'acento',
          rotulo: `${semAcento} → ${correta}`,
        });
      }
    }

    // 2. Palavras repetidas em sequência (mínimo 3 letras)
    const regexRepeticao = /(?<![\p{L}\p{N}])([\p{L}]{3,})\s+\1(?![\p{L}\p{N}])/gui;
    let match: RegExpExecArray | null;
    while ((match = regexRepeticao.exec(texto)) !== null) {
      const palavra = match[1].toLowerCase();
      const chave = `rep:${palavra}`;
      if (!vistas.has(chave)) {
        vistas.add(chave);
        resultado.push({
          errada: palavra,
          correta: palavra,
          tipo: 'repeticao',
          rotulo: `Palavra repetida: ${palavra}`,
        });
      }
    }

    return resultado;
  }
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

export interface AnaliseCompletaCurriculo extends AvaliacaoCurriculo {
  ortografia: ItemOrtografico[];
  competenciasReconhecidas: Competencia[];
  scorePreparacao: number;
}

export function avaliarCurriculoCompleto(texto: string): AnaliseCompletaCurriculo {
  const avaliacao = AvaliadorDeCurriculo.avaliar(texto);
  const ortografia = VerificadorOrtografico.verificar(texto);
  const competenciasReconhecidas = detectarCompetencias(texto);

  // Calcula um índice de estrutura do currículo (0 a 100)
  const secoesValues = Object.values(avaliacao.secoesDetectadas);
  const secoesPresentes = secoesValues.filter(Boolean).length;
  const baseSecoes = (secoesPresentes / secoesValues.length) * 60;
  const bonusPontosFortes = Math.min(30, avaliacao.pontosFortes.length * 8);
  const bonusSemErrosOrto = texto.trim().length > 0 && ortografia.length === 0 ? 10 : 0;
  const scorePreparacao =
    texto.trim().length === 0
      ? 0
      : Math.min(100, Math.round(baseSecoes + bonusPontosFortes + bonusSemErrosOrto));

  return {
    ...avaliacao,
    ortografia,
    competenciasReconhecidas,
    scorePreparacao,
  };
}

import { escaparRegex, normalizarTexto } from '../competencia/normalizarTexto';

export interface ItemOrtografico {
  errada: string;
  correta: string;
  tipo: 'acento' | 'repeticao';
  rotulo: string; // Ex: "experiencia → experiência" ou "Palavra repetida: texto"
}

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
      // Se a palavra correta for igual à sem acento (caso não haja acento), ignora
      if (correta.toLowerCase() === semAcento) continue;

      // Busca a palavra sem acento com fronteira de letras Unicode
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
    const regexRepeticao = /(?<![\p{L}\p{N}])([\p{L}]{3,})\s+\1(?![[\p{L}\p{N}])/gui;
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

import { detectarCompetencias } from './catalog';
import { Requisito } from './models';
import { normalizarTexto } from './textNormalizer';

const PALAVRAS_IGNORAR_GENERICO = new Set([
  'conhecimento',
  'experiencia',
  'nocoes',
  'sobre',
  'desejavel',
  'vivencia',
  'capacidade',
  'habilidade',
  'boa',
  'bom',
  'para',
  'como',
  'mais',
  'muito',
  'trabalhar',
  'trabalho',
  'utilizacao',
  'utilizando',
]);

export class ExtratorDeRequisitos {
  static extrair(textoVaga: string): Requisito[] {
    if (!textoVaga) return [];

    const linhas = textoVaga.split(/\r?\n/);
    let pesoAtual = 2;
    let genericosCount = 0;
    const mapaRequisitos = new Map<string, Requisito>();

    for (const linhaBruta of linhas) {
      const linha = linhaBruta.trim();
      if (!linha) continue;

      const linhaLimpa = linha.replace(/^[\s\-•*·]+/, '').trim();
      const linhaNormalizada = normalizarTexto(linhaLimpa);

      if (/^(requisitos?|obrigatori[a-z]*)/.test(linhaNormalizada)) {
        pesoAtual = 2;
      } else if (/^(diferencia(l|is)|desejav[a-z]*|atividades|responsabilidades)/.test(linhaNormalizada)) {
        pesoAtual = 1;
      } else if (/^(beneficios|sobre\b)/.test(linhaNormalizada)) {
        pesoAtual = 0;
      }

      if (pesoAtual === 0) continue;

      const comps = detectarCompetencias(linha);

      if (comps.length >= 2 && /(^|[^a-z0-9])(ou|or)([^a-z0-9]|$)|(\/)/.test(linhaNormalizada)) {
        const rotulo = comps.map((c) => c.rotulo).join(' ou ');
        const id = 'grupo:' + comps.map((c) => c.id).sort().join('+');
        this.salvarRequisito(mapaRequisitos, {
          id,
          rotulo,
          peso: pesoAtual,
          tipo: 'grupo',
          competencias: comps,
          textoOriginal: linhaLimpa,
        });
      } else if (comps.length > 0) {
        for (const comp of comps) {
          const id = 'comp:' + comp.id;
          this.salvarRequisito(mapaRequisitos, {
            id,
            rotulo: comp.rotulo,
            peso: pesoAtual,
            tipo: 'competencia',
            competencias: [comp],
            textoOriginal: linhaLimpa,
          });
        }
      } else {
        const comecaComMarcador = /^[-•*·]/.test(linha);
        if (comecaComMarcador && linhaLimpa.length >= 12 && genericosCount < 6) {
          const tokens = normalizarTexto(linhaLimpa)
            .split(/[^a-z0-9]+/)
            .filter((token) => token.length >= 5 && !PALAVRAS_IGNORAR_GENERICO.has(token));

          if (tokens.length > 0) {
            const id = 'gen:' + normalizarTexto(linhaLimpa).replace(/[^a-z0-9]+/g, '-').slice(0, 50);
            this.salvarRequisito(mapaRequisitos, {
              id,
              rotulo: linhaLimpa,
              peso: pesoAtual,
              tipo: 'generico',
              competencias: [],
              tokensGenericos: tokens,
              textoOriginal: linhaLimpa,
            });
            genericosCount++;
          }
        }
      }
    }

    return Array.from(mapaRequisitos.values());
  }

  private static salvarRequisito(mapa: Map<string, Requisito>, novo: Requisito): void {
    const existente = mapa.get(novo.id);
    if (!existente) {
      mapa.set(novo.id, novo);
    } else if (novo.peso > existente.peso) {
      existente.peso = novo.peso;
    }
  }
}

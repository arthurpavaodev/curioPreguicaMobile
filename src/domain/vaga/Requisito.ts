import { Competencia } from '../competencia/Competencia';

export type TipoRequisito = 'competencia' | 'grupo' | 'generico';

export interface Requisito {
  id: string;
  rotulo: string;
  peso: number; // 2 = obrigatório, 1 = diferencial/desejável
  tipo: TipoRequisito;
  competencias: Competencia[];
  tokensGenericos?: string[];
  textoOriginal?: string;
}

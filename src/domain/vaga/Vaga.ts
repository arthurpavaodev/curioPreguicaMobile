import { Requisito } from './Requisito';

export type OrigemVaga = 'exemplo' | 'empresa' | 'aluno';

export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  descricao: string;
  origem: OrigemVaga;
  requisitos: Requisito[];
}

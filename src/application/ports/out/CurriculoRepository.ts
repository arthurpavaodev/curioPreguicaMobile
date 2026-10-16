import { Curriculo } from '../../../domain';

export interface CurriculoRepository {
  obter(): Promise<Curriculo | null>;
  salvar(curriculo: Curriculo): Promise<void>;
  limpar(): Promise<void>;
}

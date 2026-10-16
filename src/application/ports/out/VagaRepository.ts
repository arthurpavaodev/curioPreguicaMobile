import { Vaga } from '../../../domain';

export interface VagaRepository {
  listarExemplos(): Promise<Vaga[]>;
  listarPersonalizadas(): Promise<Vaga[]>;
  adicionar(vaga: Vaga): Promise<void>;
  remover(id: string): Promise<void>;
  obterPorId(id: string): Promise<Vaga | null>;
}

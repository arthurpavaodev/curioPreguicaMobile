import { Curriculo } from '../../../domain';
import { CurriculoRepository } from '../../../application';

export class InMemoryCurriculoRepository implements CurriculoRepository {
  private curriculo: Curriculo | null = null;

  constructor(inicial: Curriculo | null = null) {
    this.curriculo = inicial;
  }

  async obter(): Promise<Curriculo | null> {
    return this.curriculo;
  }

  async salvar(curriculo: Curriculo): Promise<void> {
    this.curriculo = { ...curriculo };
  }

  async limpar(): Promise<void> {
    this.curriculo = null;
  }
}

import { Vaga } from '../../../domain';
import { VagaRepository } from '../../../application';

export class InMemoryVagaRepository implements VagaRepository {
  private exemplos: Vaga[] = [];
  private personalizadas: Vaga[] = [];

  constructor(exemplosIniciais: Vaga[] = [], personalizadasIniciais: Vaga[] = []) {
    this.exemplos = [...exemplosIniciais];
    this.personalizadas = [...personalizadasIniciais];
  }

  async listarExemplos(): Promise<Vaga[]> {
    return [...this.exemplos];
  }

  async listarPersonalizadas(): Promise<Vaga[]> {
    return [...this.personalizadas];
  }

  async adicionar(vaga: Vaga): Promise<void> {
    this.personalizadas.push(vaga);
  }

  async remover(id: string): Promise<void> {
    this.personalizadas = this.personalizadas.filter((v) => v.id !== id);
  }

  async obterPorId(id: string): Promise<Vaga | null> {
    const encontrada =
      this.exemplos.find((v) => v.id === id) ||
      this.personalizadas.find((v) => v.id === id);
    return encontrada || null;
  }
}

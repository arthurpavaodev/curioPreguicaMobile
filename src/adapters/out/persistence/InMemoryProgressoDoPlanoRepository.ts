import { ProgressoDoPlanoRepository } from '../../../application';

export class InMemoryProgressoDoPlanoRepository implements ProgressoDoPlanoRepository {
  private progresso: Record<string, boolean> = {};

  constructor(inicial: Record<string, boolean> = {}) {
    this.progresso = { ...inicial };
  }

  async obter(): Promise<Record<string, boolean>> {
    return { ...this.progresso };
  }

  async definir(etapaId: string, concluida: boolean): Promise<void> {
    this.progresso[etapaId] = concluida;
  }
}

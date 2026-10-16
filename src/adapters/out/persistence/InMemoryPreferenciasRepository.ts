import { PerfilUsuario, PreferenciasRepository } from '../../../application';

export class InMemoryPreferenciasRepository implements PreferenciasRepository {
  private perfil: PerfilUsuario = 'aluno';
  private vagaSelecionadaId: string | null = null;

  constructor(perfilInicial: PerfilUsuario = 'aluno', vagaIdInicial: string | null = null) {
    this.perfil = perfilInicial;
    this.vagaSelecionadaId = vagaIdInicial;
  }

  async obterPerfil(): Promise<PerfilUsuario> {
    return this.perfil;
  }

  async salvarPerfil(perfil: PerfilUsuario): Promise<void> {
    this.perfil = perfil;
  }

  async obterVagaSelecionadaId(): Promise<string | null> {
    return this.vagaSelecionadaId;
  }

  async salvarVagaSelecionadaId(id: string | null): Promise<void> {
    this.vagaSelecionadaId = id;
  }
}

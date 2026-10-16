export type PerfilUsuario = 'aluno' | 'teia' | 'empresa';

export interface PreferenciasRepository {
  obterPerfil(): Promise<PerfilUsuario>;
  salvarPerfil(perfil: PerfilUsuario): Promise<void>;
  obterVagaSelecionadaId(): Promise<string | null>;
  salvarVagaSelecionadaId(id: string | null): Promise<void>;
}

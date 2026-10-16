export interface ProgressoDoPlanoRepository {
  obter(): Promise<Record<string, boolean>>;
  definir(etapaId: string, concluida: boolean): Promise<void>;
}

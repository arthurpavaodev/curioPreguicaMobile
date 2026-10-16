export type GrupoEtapa = 'curriculo' | 'competencias';

export interface EtapaDoPlano {
  id: string;
  vagaId: string;
  grupo: GrupoEtapa;
  titulo: string;
  detalhe: string;
  concluida: boolean;
}

import { EtapaDoPlano } from './EtapaDoPlano';

export interface PlanoDeVoo {
  vagaId: string;
  etapas: EtapaDoPlano[];
  concluidasCount: number;
  totalEtapas: number;
  progresso: number; // Porcentagem 0 a 100
}

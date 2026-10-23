import { flightPlanRepository } from '../../../data';
import {
  CalculadoraDeAderencia,
  GeradorDePlano,
  PlanoDeVoo,
  Vaga,
} from '../../../domain';

export const flightPlanService = {
  async obterProgresso(): Promise<Record<string, boolean>> {
    return flightPlanRepository.obter();
  },

  async alternarEtapa(etapaId: string, concluida: boolean): Promise<Record<string, boolean>> {
    return flightPlanRepository.definir(etapaId, concluida);
  },

  gerarPlano(
    textoCurriculo: string,
    vaga: Vaga,
    progressoMap: Record<string, boolean>,
  ): PlanoDeVoo {
    const diag = CalculadoraDeAderencia.calcular(textoCurriculo, vaga, 'basica');
    return GeradorDePlano.gerar(diag, progressoMap);
  },
};

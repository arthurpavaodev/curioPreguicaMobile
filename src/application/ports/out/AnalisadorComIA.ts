import { Diagnostico, Vaga } from '../../../domain';

export interface AnalisadorComIA {
  disponivel(): boolean;
  analisar(curriculoTexto: string, vaga: Vaga): Promise<Diagnostico>;
}

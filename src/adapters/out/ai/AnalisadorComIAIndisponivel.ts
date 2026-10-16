import { Diagnostico, Vaga } from '../../../domain';
import { AnalisadorComIA } from '../../../application';

export class AnalisadorComIAIndisponivel implements AnalisadorComIA {
  disponivel(): boolean {
    return false;
  }

  async analisar(_curriculoTexto: string, _vaga: Vaga): Promise<Diagnostico> {
    throw new Error('Análise com IA indisponível neste ambiente offline.');
  }
}

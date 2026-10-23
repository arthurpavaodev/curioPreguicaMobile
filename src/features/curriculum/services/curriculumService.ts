import { curriculumRepository, importarArquivoTxt } from '../../../data';
import { AnaliseCompletaCurriculo, Curriculo, avaliarCurriculoCompleto } from '../../../domain';

export const curriculumService = {
  async obterCurriculo(): Promise<Curriculo> {
    return curriculumRepository.obter();
  },

  async salvarCurriculo(texto: string): Promise<Curriculo> {
    return curriculumRepository.salvarTexto(texto);
  },

  async limparCurriculo(): Promise<Curriculo> {
    return curriculumRepository.limpar();
  },

  async importarDeArquivoTxt(): Promise<string | null> {
    return importarArquivoTxt();
  },

  avaliar(texto: string): AnaliseCompletaCurriculo {
    return avaliarCurriculoCompleto(texto);
  },
};

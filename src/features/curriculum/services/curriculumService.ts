import {
  ResultadoImportacaoPdf,
  curriculumRepository,
  importarArquivoPdf,
  importarArquivoTxt,
} from '../../../data';
import { AnaliseCompletaCurriculo, Curriculo, avaliarCurriculoCompleto } from '../../../domain';

export const curriculumService = {
  async obterCurriculo(): Promise<Curriculo> {
    return curriculumRepository.obter();
  },

  async salvarCurriculo(
    texto: string,
    nomeArquivo?: string,
    formatoOrigem?: 'pdf' | 'manual' | 'exemplo',
  ): Promise<Curriculo> {
    return curriculumRepository.salvarTexto(texto, nomeArquivo, formatoOrigem);
  },

  async limparCurriculo(): Promise<Curriculo> {
    return curriculumRepository.limpar();
  },

  async importarDeArquivoPdf(): Promise<ResultadoImportacaoPdf | null> {
    return importarArquivoPdf();
  },

  async importarDeArquivoTxt(): Promise<string | null> {
    return importarArquivoTxt();
  },

  avaliar(texto: string): AnaliseCompletaCurriculo {
    return avaliarCurriculoCompleto(texto);
  },
};

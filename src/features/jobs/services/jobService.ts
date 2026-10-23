import { jobRepository } from '../../../data';
import {
  CalculadoraDeAderencia,
  Diagnostico,
  OrigemVaga,
  PerfilUsuario,
  Vaga,
} from '../../../domain';

export const jobService = {
  async listarVagas(perfil: PerfilUsuario = 'aluno'): Promise<Vaga[]> {
    return jobRepository.listarTodas(perfil);
  },

  async adicionarVaga(input: {
    titulo: string;
    empresa?: string;
    texto: string;
    origem: OrigemVaga;
  }): Promise<Vaga> {
    return jobRepository.criarEAdicionar(input);
  },

  async removerVaga(id: string): Promise<void> {
    return jobRepository.remover(id);
  },

  diagnosticar(textoCurriculo: string, vaga: Vaga): Diagnostico {
    return CalculadoraDeAderencia.calcular(textoCurriculo, vaga, 'basica');
  },
};

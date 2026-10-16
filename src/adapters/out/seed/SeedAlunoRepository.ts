import { Aluno } from '../../../domain';
import { AlunoRepository } from '../../../application';
import { ALUNOS_EXEMPLO } from './SeedData';

export class SeedAlunoRepository implements AlunoRepository {
  async listar(): Promise<Aluno[]> {
    return [...ALUNOS_EXEMPLO];
  }
}

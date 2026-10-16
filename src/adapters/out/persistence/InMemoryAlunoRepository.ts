import { Aluno } from '../../../domain';
import { AlunoRepository } from '../../../application';

export class InMemoryAlunoRepository implements AlunoRepository {
  private alunos: Aluno[] = [];

  constructor(alunosIniciais: Aluno[] = []) {
    this.alunos = [...alunosIniciais];
  }

  async listar(): Promise<Aluno[]> {
    return [...this.alunos];
  }
}

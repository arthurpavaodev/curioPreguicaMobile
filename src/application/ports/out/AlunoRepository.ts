import { Aluno } from '../../../domain';

export interface AlunoRepository {
  listar(): Promise<Aluno[]>;
}

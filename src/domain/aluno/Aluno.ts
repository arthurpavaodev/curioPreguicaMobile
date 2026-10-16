export interface Aluno {
  id: string;
  nome: string;
  modulo: number;
  curriculoTexto: string;
}

export interface AlunoRankeado {
  aluno: Aluno;
  aderencia: number | null;
  compativel: boolean; // aderencia !== null && aderencia >= aderenciaMinima
  faltam: string[]; // Até 3 itens dos requisitos que faltam
}

export interface SecoesDetectadas {
  objetivo: boolean;
  formacao: boolean;
  projetos: boolean;
  habilidades: boolean;
  idiomas: boolean;
}

export interface Curriculo {
  texto: string;
  palavras: number;
  secoesDetectadas: SecoesDetectadas;
  atualizadoEm: string;
}

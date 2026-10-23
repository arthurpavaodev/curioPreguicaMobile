export type TipoCompetencia = 'tech' | 'soft' | 'idioma';

export interface Competencia {
  id: string;
  rotulo: string;
  tipo: TipoCompetencia;
  aliases: string[];
}

export type TipoRequisito = 'competencia' | 'grupo' | 'generico';

export interface Requisito {
  id: string;
  rotulo: string;
  peso: number; // 2 = obrigatório, 1 = diferencial/desejável
  tipo: TipoRequisito;
  competencias: Competencia[];
  tokensGenericos?: string[];
  textoOriginal?: string;
}

export type OrigemVaga = 'exemplo' | 'empresa' | 'aluno';

export interface Vaga {
  id: string;
  titulo: string;
  empresa: string;
  descricao: string;
  origem: OrigemVaga;
  requisitos: Requisito[];
  palavrasChave?: string[];
}

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
  nomeArquivo?: string;
  formatoOrigem?: 'pdf' | 'manual' | 'exemplo';
}

export interface AvaliacaoCurriculo {
  pontosFortes: string[];
  pontosFracos: string[];
  secoesDetectadas: SecoesDetectadas;
  totalPalavras: number;
}

export interface ItemOrtografico {
  errada: string;
  correta: string;
  tipo: 'acento' | 'repeticao';
  rotulo: string;
}

export type TipoNivelAderencia = 'boa' | 'parcial' | 'baixa' | 'sem_requisitos';

export interface NivelDeAderencia {
  tipo: TipoNivelAderencia;
  rotulo: string;
}

export interface RequisitoAtendido {
  requisito: Requisito;
  evidencia: string;
}

export interface RequisitoFaltante {
  requisito: Requisito;
  obrigatorio: boolean; // true se peso === 2, false se peso === 1
  acaoSugerida: string;
}

export interface Diagnostico {
  vagaId: string;
  aderencia: number | null;
  nivel: NivelDeAderencia;
  totalRequisitos: number;
  requisitosAtendidosCount: number;
  requisitosAtendidos: RequisitoAtendido[];
  requisitosFaltantes: RequisitoFaltante[];
  palavrasChave?: string[];
  palavrasAtendidas?: string[];
  palavrasFaltantes?: string[];
  pontosFortes: string[];
  pontosFracos: string[];
  ortografia: ItemOrtografico[];
  origemAnalise: 'basica' | 'ia';
}

export type GrupoEtapa = 'curriculo' | 'competencias';

export interface EtapaDoPlano {
  id: string;
  vagaId: string;
  grupo: GrupoEtapa;
  titulo: string;
  detalhe: string;
  concluida: boolean;
}

export interface PlanoDeVoo {
  vagaId: string;
  etapas: EtapaDoPlano[];
  concluidasCount: number;
  totalEtapas: number;
  progresso: number; // Porcentagem 0 a 100
}

export interface Aluno {
  id: string;
  nome: string;
  modulo: number;
  curriculoTexto: string;
}

export interface AlunoRankeado {
  aluno: Aluno;
  aderencia: number | null;
  compativel: boolean;
  faltam: string[];
  palavrasAtendidas?: string[];
  palavrasFaltantes?: string[];
  aplicou?: boolean;
}

export interface Candidatura {
  id: string;
  vagaId: string;
  alunoId: string;
  alunoNome: string;
  criadaEm: string;
  compatibilidade: number | null;
}

export type PerfilUsuario = 'aluno' | 'teia' | 'empresa';

export interface ResumoPainelTEIA {
  cadastrados: number;
  comCurriculo: number;
  aderenciaMedia: number;
}

export interface ContagemCompatibilidadeVaga {
  vagaId: string;
  compativeis: number;
  total: number;
}

export class VagaInvalidaError extends Error {
  constructor(mensagem = 'Informe o título e a descrição da vaga com no mínimo 10 caracteres.') {
    super(mensagem);
    this.name = 'VagaInvalidaError';
  }
}

export class CurriculoInvalidoError extends Error {
  constructor(mensagem = 'O currículo fornecido é inválido.') {
    super(mensagem);
    this.name = 'CurriculoInvalidoError';
  }
}

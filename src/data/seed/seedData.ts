import {
  Aluno,
  AvaliadorDeCurriculo,
  Curriculo,
  ExtratorDeRequisitos,
  Vaga,
} from '../../domain';

export const CURRICULO_EXEMPLO_TEXTO = `NOME DO ALUNO (exemplo)
Engenharia de Software, 6º período, UNDB
São Luís, MA · exemplo@email.com · github.com/exemplo

Objetivo
Estágio em desenvolvimento de software, com foco em aplicações mobile.

Formação
Bacharelado em Engenharia de Software, UNDB (cursando, previsão 2028)

Projetos
- App de controle de gastos em React Native com Firebase, usado por 30 colegas.
- API REST em Node.js e PostgreSQL para cadastro de eventos universitários.
- Site institucional em HTML, CSS e JavaScript para uma associação local.

Habilidades
JavaScript, React Native, Node.js, SQL, Git, GitHub, Scrum

Experiencia
Monitor de Programação I (2025): apoio a 25 alunos em logica de programacao, com plantões semanais e correção de listas de exercícios.
Voluntário em projeto de extensão (2024): levantamento de requisitos com a equipe da associação e entrega do site em duas semanas.

Cursos
Introdução a Banco de Dados, 40h. Desenvolvimento Mobile com React Native, 30h.

Idiomas
Inglês intermediário, leitura de documentação técnica`;

export function criarCurriculoExemplo(): Curriculo {
  const avaliacao = AvaliadorDeCurriculo.avaliar(CURRICULO_EXEMPLO_TEXTO);
  return {
    texto: CURRICULO_EXEMPLO_TEXTO,
    palavras: avaliacao.totalPalavras,
    secoesDetectadas: avaliacao.secoesDetectadas,
    atualizadoEm: new Date().toISOString(),
  };
}

export const TEXTO_VAGA_EX1 = `Requisitos:
- Conhecimento em React Native ou Flutter
- Noções de TypeScript
- Experiência com consumo de API REST
- Git e GitHub
- Inglês para leitura técnica
Diferenciais:
- Firebase
- Testes automatizados (Jest)
- Metodologias ágeis (Scrum)`;

export const TEXTO_VAGA_EX2 = `Requisitos:
- Node.js ou Python
- SQL e PostgreSQL
- API REST
- Git
Diferenciais:
- Docker
- AWS
- Testes automatizados`;

export const TEXTO_VAGA_EX3 = `Requisitos:
- Testes de software e casos de teste
- Jira
- Metodologias ágeis
- Inglês para leitura técnica
Diferenciais:
- Cypress ou Selenium
- SQL`;

export const VAGAS_EXEMPLO: Vaga[] = [
  {
    id: 'ex1',
    titulo: 'Estágio em Desenvolvimento Mobile',
    empresa: 'Empresa Exemplo A',
    descricao: TEXTO_VAGA_EX1,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX1),
    palavrasChave: [
      'React Native',
      'Flutter',
      'TypeScript',
      'API REST',
      'Git',
      'GitHub',
      'Firebase',
      'Jest',
      'Scrum',
      'Inglês',
    ],
  },
  {
    id: 'ex2',
    titulo: 'Estágio em Back-end',
    empresa: 'Empresa Exemplo B',
    descricao: TEXTO_VAGA_EX2,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX2),
    palavrasChave: [
      'Node.js',
      'Python',
      'SQL',
      'PostgreSQL',
      'API REST',
      'Git',
      'Docker',
      'AWS',
      'Testes automatizados',
    ],
  },
  {
    id: 'ex3',
    titulo: 'Estágio em Qualidade de Software',
    empresa: 'Empresa Exemplo C',
    descricao: TEXTO_VAGA_EX3,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX3),
    palavrasChave: [
      'Testes de software',
      'Casos de teste',
      'Jira',
      'Metodologias ágeis',
      'Inglês',
      'Cypress',
      'Selenium',
      'SQL',
    ],
  },
];

export const ALUNOS_EXEMPLO: Aluno[] = [
  {
    id: 'a',
    nome: 'Aluno A',
    modulo: 6,
    curriculoTexto:
      'Habilidades: React Native, TypeScript, Git, GitHub, Firebase, Jest, API REST, Scrum. Inglês avançado.',
  },
  {
    id: 'b',
    nome: 'Aluno B',
    modulo: 5,
    curriculoTexto:
      'Habilidades: Node.js, PostgreSQL, SQL, Docker, Git, API REST, Linux, Python. Inglês intermediário.',
  },
  {
    id: 'c',
    nome: 'Aluno C',
    modulo: 6,
    curriculoTexto:
      'Habilidades: Java, Spring, SQL, MySQL, UML, Scrum, testes unitarios com JUnit, orientação a objetos.',
  },
  {
    id: 'd',
    nome: 'Aluno D',
    modulo: 4,
    curriculoTexto: 'Habilidades: HTML, CSS, JavaScript, Figma, Git.',
  },
  {
    id: 'e',
    nome: 'Aluno E',
    modulo: 7,
    curriculoTexto:
      'Habilidades: Selenium, Cypress, testes de software, casos de teste, Jira, Scrum, SQL. Inglês intermediário.',
  },
  {
    id: 'f',
    nome: 'Aluno F',
    modulo: 3,
    curriculoTexto: '',
  },
];

import {
  Aluno,
  CalculadoraDeAderencia,
  ExtratorDeRequisitos,
  RankeadorDeAlunos,
  Vaga,
  VerificadorOrtografico,
  contemTermo,
  detectarCompetencias,
  normalizarTexto,
} from '../../src/domain';

export const CURRICULO_EXEMPLO = `NOME DO ALUNO (exemplo)
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

describe('Critérios de aceite do domínio (Seção 8)', () => {
  const vagaEx1: Vaga = {
    id: 'ex1',
    titulo: 'Estágio em Desenvolvimento Mobile',
    empresa: 'Empresa Exemplo A',
    descricao: TEXTO_VAGA_EX1,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX1),
  };

  const vagaEx2: Vaga = {
    id: 'ex2',
    titulo: 'Estágio em Back-end',
    empresa: 'Empresa Exemplo B',
    descricao: TEXTO_VAGA_EX2,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX2),
  };

  const vagaEx3: Vaga = {
    id: 'ex3',
    titulo: 'Estágio em Qualidade de Software',
    empresa: 'Empresa Exemplo C',
    descricao: TEXTO_VAGA_EX3,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX3),
  };

  test('vaga ex1 com currículo de exemplo atinge exatamente 77% e lista atendidos e faltantes esperados', () => {
    const diag = CalculadoraDeAderencia.calcular(CURRICULO_EXEMPLO, vagaEx1);

    expect(diag.aderencia).toBe(77);

    const rotulosAtendidos = diag.requisitosAtendidos.map((r) => r.requisito.rotulo);
    expect(rotulosAtendidos).toEqual([
      'React Native ou Flutter',
      'API REST',
      'Git e GitHub',
      'Inglês',
      'Firebase',
      'Metodologias ágeis',
    ]);

    const rotulosFaltam = diag.requisitosFaltantes.map((r) => r.requisito.rotulo);
    expect(rotulosFaltam).toEqual(['TypeScript', 'Testes automatizados']);
  });

  test('vaga ex2 com currículo de exemplo atinge exatamente 77% e lista atendidos e faltantes esperados', () => {
    const diag = CalculadoraDeAderencia.calcular(CURRICULO_EXEMPLO, vagaEx2);

    expect(diag.aderencia).toBe(77);

    const rotulosAtendidos = diag.requisitosAtendidos.map((r) => r.requisito.rotulo);
    expect(rotulosAtendidos).toEqual([
      'Python ou Node.js',
      'SQL',
      'PostgreSQL',
      'API REST',
      'Git e GitHub',
    ]);

    const rotulosFaltam = diag.requisitosFaltantes.map((r) => r.requisito.rotulo);
    expect(rotulosFaltam).toEqual(['Docker', 'AWS / nuvem', 'Testes automatizados']);
  });

  test('vaga ex3 com currículo de exemplo atinge exatamente 50% e lista atendidos e faltantes esperados', () => {
    const diag = CalculadoraDeAderencia.calcular(CURRICULO_EXEMPLO, vagaEx3);

    expect(diag.aderencia).toBe(50);

    const rotulosAtendidos = diag.requisitosAtendidos.map((r) => r.requisito.rotulo);
    expect(rotulosAtendidos).toEqual(['Metodologias ágeis', 'Inglês', 'SQL']);

    const rotulosFaltam = diag.requisitosFaltantes.map((r) => r.requisito.rotulo);
    expect(rotulosFaltam).toEqual(['Testes de software', 'Jira', 'Testes automatizados']);
  });

  test('ortografia do currículo de exemplo detecta exatamente: experiencia, programacao, logica', () => {
    const itens = VerificadorOrtografico.verificar(CURRICULO_EXEMPLO);
    const palavrasErradas = itens.map((i) => i.errada);
    expect(palavrasErradas).toEqual(['experiencia', 'programacao', 'logica']);
  });

  test('ranking dos alunos de exemplo por vaga ex1', () => {
    const ranking = RankeadorDeAlunos.rankear(ALUNOS_EXEMPLO, vagaEx1);
    expect(ranking.map((r) => ({ nome: r.aluno.nome, aderencia: r.aderencia }))).toEqual([
      { nome: 'Aluno A', aderencia: 100 },
      { nome: 'Aluno B', aderencia: 46 },
      { nome: 'Aluno E', aderencia: 31 },
      { nome: 'Aluno C', aderencia: 15 },
      { nome: 'Aluno D', aderencia: 15 },
      { nome: 'Aluno F', aderencia: null },
    ]);
  });

  test('ranking dos alunos de exemplo por vaga ex2', () => {
    const ranking = RankeadorDeAlunos.rankear(ALUNOS_EXEMPLO, vagaEx2);
    expect(ranking.map((r) => ({ nome: r.aluno.nome, aderencia: r.aderencia }))).toEqual([
      { nome: 'Aluno B', aderencia: 85 },
      { nome: 'Aluno A', aderencia: 38 },
      { nome: 'Aluno C', aderencia: 23 },
      { nome: 'Aluno E', aderencia: 23 },
      { nome: 'Aluno D', aderencia: 15 },
      { nome: 'Aluno F', aderencia: null },
    ]);
  });

  test('ranking dos alunos de exemplo por vaga ex3', () => {
    const ranking = RankeadorDeAlunos.rankear(ALUNOS_EXEMPLO, vagaEx3);
    expect(ranking.map((r) => ({ nome: r.aluno.nome, aderencia: r.aderencia }))).toEqual([
      { nome: 'Aluno E', aderencia: 100 },
      { nome: 'Aluno A', aderencia: 50 },
      { nome: 'Aluno C', aderencia: 40 },
      { nome: 'Aluno B', aderencia: 30 },
      { nome: 'Aluno D', aderencia: 0 },
      { nome: 'Aluno F', aderencia: null },
    ]);
  });

  test('"React Native ou Flutter" gera um único requisito de grupo, atendido se qualquer um estiver no currículo', () => {
    const requisitos = ExtratorDeRequisitos.extrair('Requisitos:\n- React Native ou Flutter');
    expect(requisitos).toHaveLength(1);
    expect(requisitos[0].tipo).toBe('grupo');
    expect(requisitos[0].rotulo).toBe('React Native ou Flutter');

    const vagaTeste: Vaga = {
      id: 'teste',
      titulo: 'Teste',
      empresa: 'Teste',
      descricao: 'Requisitos:\n- React Native ou Flutter',
      origem: 'empresa',
      requisitos,
    };

    const diagRN = CalculadoraDeAderencia.calcular('Experiência com React Native', vagaTeste);
    expect(diagRN.aderencia).toBe(100);

    const diagFlutter = CalculadoraDeAderencia.calcular('Experiência com Flutter e Dart', vagaTeste);
    expect(diagFlutter.aderencia).toBe(100);
  });

  test('"react" não é detectado dentro de "react native"; "node.js" não detecta "javascript"', () => {
    const compsRN = detectarCompetencias('Desenvolvedor React Native');
    const idsRN = compsRN.map((c) => c.id);
    expect(idsRN).toContain('rn');
    expect(idsRN).not.toContain('react');

    const compsNode = detectarCompetencias('Experiência com Node.js backend');
    const idsNode = compsNode.map((c) => c.id);
    expect(idsNode).toContain('node');
    expect(idsNode).not.toContain('js');
  });

  test('"SQL" não casa dentro de "PostgreSQL"', () => {
    const texto = normalizarTexto('Trabalho com banco de dados postgresql diariamente');
    expect(contemTermo(texto, 'sql')).toBe(false);
    expect(contemTermo(texto, 'postgresql')).toBe(true);
  });

  test('texto de vaga sem requisitos reconhecíveis resulta em aderência nula', () => {
    const requisitos = ExtratorDeRequisitos.extrair(
      'Sobre a empresa:\nSomos uma empresa inovadora no mercado.',
    );
    const vagaVazia: Vaga = {
      id: 'vazia',
      titulo: 'Vaga Vazia',
      empresa: 'Empresa',
      descricao: 'Sobre a empresa:\nSomos uma empresa inovadora no mercado.',
      origem: 'empresa',
      requisitos,
    };

    const diag = CalculadoraDeAderencia.calcular(CURRICULO_EXEMPLO, vagaVazia);
    expect(diag.aderencia).toBeNull();
    expect(diag.nivel.tipo).toBe('sem_requisitos');
  });
});

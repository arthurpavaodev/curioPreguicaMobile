import {
  AdicionarVaga,
  AlternarEtapaDoPlano,
  ContarAlunosCompativeis,
  DiagnosticarCurriculo,
  LimparCurriculo,
  ListarVagas,
  ObterCurriculo,
  ObterPlanoDeVoo,
  RankearAlunosParaVaga,
  RefinarComIA,
  RemoverVaga,
  ResumirPainelDoTEIA,
  SalvarCurriculo,
} from '../../src/application';
import {
  ExtratorDeRequisitos,
  Vaga,
  VagaInvalidaError,
} from '../../src/domain';
import {
  AnalisadorComIAIndisponivel,
  GeradorDeIdSimples,
  InMemoryAlunoRepository,
  InMemoryCurriculoRepository,
  InMemoryProgressoDoPlanoRepository,
  InMemoryVagaRepository,
} from '../../src/adapters/out';
import {
  ALUNOS_EXEMPLO,
  CURRICULO_EXEMPLO,
  TEXTO_VAGA_EX1,
  TEXTO_VAGA_EX2,
} from '../domain/criteriosDeAceite.test';

describe('Application Use Cases', () => {
  let curriculoRepo: InMemoryCurriculoRepository;
  let vagaRepo: InMemoryVagaRepository;
  let alunoRepo: InMemoryAlunoRepository;
  let progressoRepo: InMemoryProgressoDoPlanoRepository;
  let geradorId: GeradorDeIdSimples;
  let analisadorIA: AnalisadorComIAIndisponivel;

  const vagaExemplo1: Vaga = {
    id: 'ex1',
    titulo: 'Estágio Mobile',
    empresa: 'Empresa A',
    descricao: TEXTO_VAGA_EX1,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX1),
  };

  const vagaExemplo2: Vaga = {
    id: 'ex2',
    titulo: 'Estágio Backend',
    empresa: 'Empresa B',
    descricao: TEXTO_VAGA_EX2,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX2),
  };

  beforeEach(() => {
    curriculoRepo = new InMemoryCurriculoRepository();
    vagaRepo = new InMemoryVagaRepository([vagaExemplo1, vagaExemplo2]);
    alunoRepo = new InMemoryAlunoRepository(ALUNOS_EXEMPLO);
    progressoRepo = new InMemoryProgressoDoPlanoRepository();
    geradorId = new GeradorDeIdSimples();
    analisadorIA = new AnalisadorComIAIndisponivel();
  });

  test('Salvar, Obter e Limpar Currículo', async () => {
    const salvar = new SalvarCurriculo(curriculoRepo);
    const obter = new ObterCurriculo(curriculoRepo);
    const limpar = new LimparCurriculo(curriculoRepo);

    expect(await obter.execute()).toBeNull();

    const salvo = await salvar.execute(CURRICULO_EXEMPLO);
    expect(salvo.texto).toBe(CURRICULO_EXEMPLO);
    expect(salvo.palavras).toBeGreaterThan(100);

    const recuperado = await obter.execute();
    expect(recuperado?.texto).toBe(CURRICULO_EXEMPLO);

    await limpar.execute();
    expect(await obter.execute()).toBeNull();
  });

  test('Listar, Adicionar e Remover Vagas com filtro por perfil e validação', async () => {
    const listar = new ListarVagas(vagaRepo);
    const adicionar = new AdicionarVaga(vagaRepo, geradorId);
    const remover = new RemoverVaga(vagaRepo);

    // Adiciona vaga colada por aluno
    const vagaAluno = await adicionar.execute({
      titulo: 'Vaga Aluno',
      texto: 'Requisitos:\n- React Native\n- Git',
      origem: 'aluno',
    });
    expect(vagaAluno.id).toBeDefined();
    expect(vagaAluno.requisitos.length).toBeGreaterThan(0);

    // Aluno enxerga todas (2 exemplos + 1 aluno)
    const vagasAluno = await listar.execute({ perfil: 'aluno' });
    expect(vagasAluno).toHaveLength(3);

    // TEIA e Empresa não veem as coladas por alunos
    const vagasTEIA = await listar.execute({ perfil: 'teia' });
    expect(vagasTEIA).toHaveLength(2);

    const vagasEmpresa = await listar.execute({ perfil: 'empresa' });
    expect(vagasEmpresa).toHaveLength(2);

    // Remover vaga criada
    await remover.execute(vagaAluno.id);
    const vagasAposRemocao = await listar.execute({ perfil: 'aluno' });
    expect(vagasAposRemocao).toHaveLength(2);

    // Não deve remover vagas de exemplo
    await remover.execute('ex1');
    const vagasAposTentativaRemoverExemplo = await listar.execute({ perfil: 'aluno' });
    expect(vagasAposTentativaRemoverExemplo).toHaveLength(2);

    // Validação de vaga inválida
    await expect(
      adicionar.execute({
        titulo: 'A',
        texto: 'curto',
        origem: 'empresa',
      }),
    ).rejects.toThrow(VagaInvalidaError);
  });

  test('DiagnosticarCurriculo calcula diagnóstico para a vaga selecionada', async () => {
    const salvar = new SalvarCurriculo(curriculoRepo);
    await salvar.execute(CURRICULO_EXEMPLO);

    const diagnosticar = new DiagnosticarCurriculo(curriculoRepo, vagaRepo);
    const diag = await diagnosticar.execute({ vagaId: 'ex1' });

    expect(diag.vagaId).toBe('ex1');
    expect(diag.aderencia).toBe(77);
    expect(diag.nivel.tipo).toBe('boa');
  });

  test('ObterPlanoDeVoo e AlternarEtapaDoPlano persistem o progresso', async () => {
    const salvar = new SalvarCurriculo(curriculoRepo);
    await salvar.execute(CURRICULO_EXEMPLO);

    const obterPlano = new ObterPlanoDeVoo(curriculoRepo, vagaRepo, progressoRepo);
    const alternar = new AlternarEtapaDoPlano(progressoRepo);

    const planoInicial = await obterPlano.execute({ vagaId: 'ex1' });
    expect(planoInicial.progresso).toBe(0);

    const primeiraEtapaId = planoInicial.etapas[0].id;
    await alternar.execute({ etapaId: primeiraEtapaId, concluida: true });

    const planoAtualizado = await obterPlano.execute({ vagaId: 'ex1' });
    expect(planoAtualizado.concluidasCount).toBe(1);
    expect(planoAtualizado.etapas[0].concluida).toBe(true);
  });

  test('RankearAlunosParaVaga retorna o ranking ordenado de alunos', async () => {
    const rankear = new RankearAlunosParaVaga(alunoRepo, vagaRepo);
    const ranking = await rankear.execute({ vagaId: 'ex1' });

    expect(ranking[0].aluno.nome).toBe('Aluno A');
    expect(ranking[0].aderencia).toBe(100);
    expect(ranking[ranking.length - 1].aluno.nome).toBe('Aluno F');
    expect(ranking[ranking.length - 1].aderencia).toBeNull();
  });

  test('ResumirPainelDoTEIA resume os indicadores da vaga selecionada', async () => {
    const resumir = new ResumirPainelDoTEIA(alunoRepo, vagaRepo);
    const resumo = await resumir.execute({ vagaId: 'ex1' });

    expect(resumo.cadastrados).toBe(6);
    expect(resumo.comCurriculo).toBe(5);
    // Média de aderência dos que têm currículo para ex1: (100 + 46 + 31 + 15 + 15) / 5 = 207 / 5 = 41.4 -> 41
    expect(resumo.aderenciaMedia).toBe(41);
  });

  test('ContarAlunosCompativeis calcula a contagem para todas as vagas', async () => {
    const contar = new ContarAlunosCompativeis(alunoRepo, vagaRepo);
    const contagem = await contar.execute({ aderenciaMinima: 60 });

    // Para ex1, apenas Aluno A (100%) é compatível (>= 60)
    expect(contagem['ex1'].compativeis).toBe(1);
    expect(contagem['ex1'].total).toBe(6);

    // Para ex2, apenas Aluno B (85%) é compatível (>= 60)
    expect(contagem['ex2'].compativeis).toBe(1);
    expect(contagem['ex2'].total).toBe(6);
  });

  test('RefinarComIA lança erro quando IA está indisponível', async () => {
    const refinar = new RefinarComIA(curriculoRepo, vagaRepo, analisadorIA);
    await expect(refinar.execute({ vagaId: 'ex1' })).rejects.toThrow(
      'Análise com IA indisponível',
    );
  });
});

import {
  AdicionarVaga,
  AlternarEtapaDoPlano,
  AlunoRepository,
  AnalisadorComIA,
  ContarAlunosCompativeis,
  CurriculoRepository,
  DiagnosticarCurriculo,
  GeradorDeId,
  LeitorDeArquivoDeCurriculo,
  LimparCurriculo,
  ListarVagas,
  ObterCurriculo,
  ObterPlanoDeVoo,
  PreferenciasRepository,
  ProgressoDoPlanoRepository,
  RankearAlunosParaVaga,
  RefinarComIA,
  RemoverVaga,
  ResumirPainelDoTEIA,
  SalvarCurriculo,
  VagaRepository,
} from '../application';
import {
  AnalisadorComIAIndisponivel,
  AsyncStorageCurriculoRepository,
  AsyncStoragePreferenciasRepository,
  AsyncStorageProgressoDoPlanoRepository,
  AsyncStorageVagaRepository,
  DocumentPickerLeitorDeArquivo,
  GeradorDeIdSimples,
  SeedAlunoRepository,
} from '../adapters/out';

export interface DependencyContainer {
  // Portas de saída
  curriculoRepo: CurriculoRepository;
  vagaRepo: VagaRepository;
  alunoRepo: AlunoRepository;
  progressoRepo: ProgressoDoPlanoRepository;
  preferenciasRepo: PreferenciasRepository;
  leitorArquivo: LeitorDeArquivoDeCurriculo;
  analisadorIA: AnalisadorComIA;
  geradorId: GeradorDeId;

  // Casos de uso (portas de entrada)
  obterCurriculo: ObterCurriculo;
  salvarCurriculo: SalvarCurriculo;
  limparCurriculo: LimparCurriculo;
  listarVagas: ListarVagas;
  adicionarVaga: AdicionarVaga;
  removerVaga: RemoverVaga;
  diagnosticarCurriculo: DiagnosticarCurriculo;
  refinarComIA: RefinarComIA;
  obterPlanoDeVoo: ObterPlanoDeVoo;
  alternarEtapaDoPlano: AlternarEtapaDoPlano;
  rankearAlunosParaVaga: RankearAlunosParaVaga;
  resumirPainelDoTEIA: ResumirPainelDoTEIA;
  contarAlunosCompativeis: ContarAlunosCompativeis;
}

export interface ContainerConfig {
  curriculoRepo?: CurriculoRepository;
  vagaRepo?: VagaRepository;
  alunoRepo?: AlunoRepository;
  progressoRepo?: ProgressoDoPlanoRepository;
  preferenciasRepo?: PreferenciasRepository;
  leitorArquivo?: LeitorDeArquivoDeCurriculo;
  analisadorIA?: AnalisadorComIA;
  geradorId?: GeradorDeId;
}

export function criarContainer(config: ContainerConfig = {}): DependencyContainer {
  const curriculoRepo = config.curriculoRepo ?? new AsyncStorageCurriculoRepository();
  const vagaRepo = config.vagaRepo ?? new AsyncStorageVagaRepository();
  const alunoRepo = config.alunoRepo ?? new SeedAlunoRepository();
  const progressoRepo = config.progressoRepo ?? new AsyncStorageProgressoDoPlanoRepository();
  const preferenciasRepo = config.preferenciasRepo ?? new AsyncStoragePreferenciasRepository();
  const leitorArquivo = config.leitorArquivo ?? new DocumentPickerLeitorDeArquivo();
  const analisadorIA = config.analisadorIA ?? new AnalisadorComIAIndisponivel();
  const geradorId = config.geradorId ?? new GeradorDeIdSimples();

  return {
    curriculoRepo,
    vagaRepo,
    alunoRepo,
    progressoRepo,
    preferenciasRepo,
    leitorArquivo,
    analisadorIA,
    geradorId,

    obterCurriculo: new ObterCurriculo(curriculoRepo),
    salvarCurriculo: new SalvarCurriculo(curriculoRepo),
    limparCurriculo: new LimparCurriculo(curriculoRepo),
    listarVagas: new ListarVagas(vagaRepo),
    adicionarVaga: new AdicionarVaga(vagaRepo, geradorId),
    removerVaga: new RemoverVaga(vagaRepo),
    diagnosticarCurriculo: new DiagnosticarCurriculo(curriculoRepo, vagaRepo),
    refinarComIA: new RefinarComIA(curriculoRepo, vagaRepo, analisadorIA),
    obterPlanoDeVoo: new ObterPlanoDeVoo(curriculoRepo, vagaRepo, progressoRepo),
    alternarEtapaDoPlano: new AlternarEtapaDoPlano(progressoRepo),
    rankearAlunosParaVaga: new RankearAlunosParaVaga(alunoRepo, vagaRepo),
    resumirPainelDoTEIA: new ResumirPainelDoTEIA(alunoRepo, vagaRepo),
    contarAlunosCompativeis: new ContarAlunosCompativeis(alunoRepo, vagaRepo),
  };
}

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ALUNOS_EXEMPLO,
  CURRICULO_EXEMPLO_TEXTO,
  CurriculumRepository,
  FlightPlanRepository,
  JobRepository,
  PreferencesRepository,
  StudentRepository,
  criarCurriculoExemplo,
  curriculumRepository as defaultCurriculumRepo,
  flightPlanRepository as defaultFlightPlanRepo,
  importarArquivoTxt,
  jobRepository as defaultJobRepo,
  preferencesRepository as defaultPreferencesRepo,
  studentRepository as defaultStudentRepo,
} from '../../data';
import {
  Aluno,
  AnaliseCompletaCurriculo,
  AvaliadorDeCurriculo,
  CalculadoraDeAderencia,
  Curriculo,
  Diagnostico,
  GeradorDePlano,
  OrigemVaga,
  PerfilUsuario,
  PlanoDeVoo,
  Vaga,
  avaliarCurriculoCompleto,
} from '../../domain';

export interface VagaComDiagnostico {
  vaga: Vaga;
  aderencia: number | null;
  diagnostico: Diagnostico;
}

export interface AppRepositories {
  curriculumRepo?: CurriculumRepository;
  jobRepo?: JobRepository;
  flightPlanRepo?: FlightPlanRepository;
  preferencesRepo?: PreferencesRepository;
  studentRepo?: StudentRepository;
  fileReader?: () => Promise<string | null>;
}

export interface AppDataContextValue {
  // Estado base
  perfil: PerfilUsuario;
  curriculo: Curriculo;
  textoCurriculo: string;
  isCurriculoExemplo: boolean;
  todasVagas: Vaga[];
  vagasVisiveis: Vaga[];
  vagaSelecionadaId: string | null;
  vagaSelecionada: Vaga | null;
  progressoMap: Record<string, boolean>;
  alunos: Aluno[];
  carregando: boolean;
  salvandoCurriculo: boolean;
  erro: string | null;

  // Dados derivados reativos (sempre sincronizados entre abas)
  analiseCurriculo: AnaliseCompletaCurriculo;
  vagasComDiagnostico: VagaComDiagnostico[];
  diagnosticoAtual: Diagnostico | null;
  planoAtual: PlanoDeVoo | null;

  // Ações
  selecionarPerfil: (novoPerfil: PerfilUsuario) => Promise<void>;
  selecionarVaga: (vagaId: string) => Promise<void>;
  atualizarTextoCurriculo: (novoTexto: string) => void;
  salvarCurriculoAgora: () => Promise<void>;
  usarCurriculoExemplo: () => Promise<void>;
  limparCurriculo: () => Promise<void>;
  importarCurriculoTxt: () => Promise<boolean>;
  adicionarVaga: (input: {
    titulo: string;
    empresa?: string;
    texto: string;
    origem: OrigemVaga;
  }) => Promise<Vaga>;
  removerVaga: (id: string) => Promise<void>;
  alternarEtapaPlano: (etapaId: string, concluida: boolean) => Promise<void>;
  recarregarDados: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

export interface AppDataProviderProps {
  repositories?: AppRepositories;
  children: React.ReactNode;
}

export function AppDataProvider({ repositories, children }: AppDataProviderProps) {
  const curriculumRepo = repositories?.curriculumRepo ?? defaultCurriculumRepo;
  const jobRepo = repositories?.jobRepo ?? defaultJobRepo;
  const flightPlanRepo = repositories?.flightPlanRepo ?? defaultFlightPlanRepo;
  const preferencesRepo = repositories?.preferencesRepo ?? defaultPreferencesRepo;
  const studentRepo = repositories?.studentRepo ?? defaultStudentRepo;
  const fileReader = repositories?.fileReader ?? importarArquivoTxt;

  const [perfil, setPerfil] = useState<PerfilUsuario>('aluno');
  const [curriculo, setCurriculo] = useState<Curriculo>(() => criarCurriculoExemplo());
  const [textoCurriculo, setTextoCurriculo] = useState<string>(CURRICULO_EXEMPLO_TEXTO);
  const [todasVagas, setTodasVagas] = useState<Vaga[]>([]);
  const [vagaSelecionadaId, setVagaSelecionadaId] = useState<string | null>('ex1');
  const [progressoMap, setProgressoMap] = useState<Record<string, boolean>>({});
  const [alunos, setAlunos] = useState<Aluno[]>(ALUNOS_EXEMPLO);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvandoCurriculo, setSalvandoCurriculo] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textoPendenteRef = useRef<string | null>(null);

  const recarregarDados = useCallback(async () => {
    try {
      setErro(null);
      const [
        perfilSalvo,
        vagaIdSalva,
        curriculoSalvo,
        vagasCarregadas,
        progressoSalvo,
        alunosCarregados,
      ] = await Promise.all([
        preferencesRepo.obterPerfil(),
        preferencesRepo.obterVagaSelecionadaId(),
        curriculumRepo.obter(),
        jobRepo.listarTodas('aluno'),
        flightPlanRepo.obter(),
        studentRepo.listar(),
      ]);

      setPerfil(perfilSalvo);
      setCurriculo(curriculoSalvo);
      setTextoCurriculo(curriculoSalvo.texto);
      setTodasVagas(vagasCarregadas);
      setProgressoMap(progressoSalvo);
      setAlunos(alunosCarregados);

      const vagaExiste = vagasCarregadas.some((v) => v.id === vagaIdSalva);
      const idValido = vagaExiste ? vagaIdSalva : (vagasCarregadas[0]?.id ?? null);
      setVagaSelecionadaId(idValido);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar dados locais.');
    } finally {
      setCarregando(false);
    }
  }, [curriculumRepo, flightPlanRepo, jobRepo, preferencesRepo, studentRepo]);

  useEffect(() => {
    recarregarDados();
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [recarregarDados]);

  // Vagas visíveis conforme o perfil ativo (TEIA e Empresa não listam rascunhos colados por aluno)
  const vagasVisiveis = useMemo(() => {
    if (perfil === 'aluno') return todasVagas;
    return todasVagas.filter((v) => v.origem !== 'aluno');
  }, [todasVagas, perfil]);

  // Garante que a vaga selecionada seja válida para o perfil ativo
  const vagaSelecionada = useMemo(() => {
    if (vagasVisiveis.length === 0) return null;
    const encontrada = vagasVisiveis.find((v) => v.id === vagaSelecionadaId);
    return encontrada ?? vagasVisiveis[0];
  }, [vagasVisiveis, vagaSelecionadaId]);

  // Avaliação reativa do currículo usando o texto em edição
  const analiseCurriculo = useMemo(
    () => avaliarCurriculoCompleto(textoCurriculo),
    [textoCurriculo],
  );

  // Diagnóstico reativo para todas as vagas visíveis
  const vagasComDiagnostico = useMemo<VagaComDiagnostico[]>(() => {
    return vagasVisiveis.map((vaga) => {
      const diagnostico = CalculadoraDeAderencia.calcular(textoCurriculo, vaga, 'basica');
      return {
        vaga,
        aderencia: diagnostico.aderencia,
        diagnostico,
      };
    });
  }, [vagasVisiveis, textoCurriculo]);

  // Diagnóstico da vaga selecionada (sempre sincronizado com o currículo atual)
  const diagnosticoAtual = useMemo<Diagnostico | null>(() => {
    if (!vagaSelecionada) return null;
    const item = vagasComDiagnostico.find((vd) => vd.vaga.id === vagaSelecionada.id);
    if (item) return item.diagnostico;
    return CalculadoraDeAderencia.calcular(textoCurriculo, vagaSelecionada, 'basica');
  }, [vagaSelecionada, vagasComDiagnostico, textoCurriculo]);

  // Plano de voo derivado reativamente do diagnóstico atual + progresso persistido
  const planoAtual = useMemo<PlanoDeVoo | null>(() => {
    if (!diagnosticoAtual) return null;
    return GeradorDePlano.gerar(diagnosticoAtual, progressoMap);
  }, [diagnosticoAtual, progressoMap]);

  const selecionarPerfil = useCallback(
    async (novoPerfil: PerfilUsuario) => {
      setPerfil(novoPerfil);
      await preferencesRepo.salvarPerfil(novoPerfil);

      // Se a vaga selecionada era de origem 'aluno' e mudou para 'teia'/'empresa', ajusta para a primeira vaga visível
      if (novoPerfil !== 'aluno') {
        const visiveisNoPerfil = todasVagas.filter((v) => v.origem !== 'aluno');
        const aindaVisivel = visiveisNoPerfil.some((v) => v.id === vagaSelecionadaId);
        if (!aindaVisivel && visiveisNoPerfil[0]) {
          setVagaSelecionadaId(visiveisNoPerfil[0].id);
          await preferencesRepo.salvarVagaSelecionadaId(visiveisNoPerfil[0].id);
        }
      }
    },
    [preferencesRepo, todasVagas, vagaSelecionadaId],
  );

  const selecionarVaga = useCallback(
    async (vagaId: string) => {
      setVagaSelecionadaId(vagaId);
      await preferencesRepo.salvarVagaSelecionadaId(vagaId);
    },
    [preferencesRepo],
  );

  const persistirCurriculo = useCallback(
    async (textoParaSalvar: string) => {
      try {
        setSalvandoCurriculo(true);
        const salvo = await curriculumRepo.salvarTexto(textoParaSalvar);
        setCurriculo(salvo);
        textoPendenteRef.current = null;
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao salvar currículo.');
      } finally {
        setSalvandoCurriculo(false);
      }
    },
    [curriculumRepo],
  );

  const atualizarTextoCurriculo = useCallback(
    (novoTexto: string) => {
      setTextoCurriculo(novoTexto);
      textoPendenteRef.current = novoTexto;

      // Atualiza metadados do currículo imediatamente em memória
      const avaliacao = AvaliadorDeCurriculo.avaliar(novoTexto);
      setCurriculo({
        texto: novoTexto,
        palavras: avaliacao.totalPalavras,
        secoesDetectadas: avaliacao.secoesDetectadas,
        atualizadoEm: new Date().toISOString(),
      });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      setSalvandoCurriculo(true);
      debounceRef.current = setTimeout(() => {
        persistirCurriculo(novoTexto);
      }, 300);
    },
    [persistirCurriculo],
  );

  const salvarCurriculoAgora = useCallback(async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (textoPendenteRef.current !== null) {
      await persistirCurriculo(textoPendenteRef.current);
    }
  }, [persistirCurriculo]);

  const usarCurriculoExemplo = useCallback(async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setTextoCurriculo(CURRICULO_EXEMPLO_TEXTO);
    await persistirCurriculo(CURRICULO_EXEMPLO_TEXTO);
  }, [persistirCurriculo]);

  const limparCurriculo = useCallback(async () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    try {
      setSalvandoCurriculo(true);
      setTextoCurriculo('');
      textoPendenteRef.current = null;
      const vazio = await curriculumRepo.limpar();
      setCurriculo(vazio);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao limpar currículo.');
    } finally {
      setSalvandoCurriculo(false);
    }
  }, [curriculumRepo]);

  const importarCurriculoTxt = useCallback(async (): Promise<boolean> => {
    try {
      setSalvandoCurriculo(true);
      const conteudo = await fileReader();
      if (conteudo !== null) {
        setTextoCurriculo(conteudo);
        await persistirCurriculo(conteudo);
        return true;
      }
      return false;
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao importar arquivo .txt.');
      return false;
    } finally {
      setSalvandoCurriculo(false);
    }
  }, [fileReader, persistirCurriculo]);

  const adicionarVaga = useCallback(
    async (input: {
      titulo: string;
      empresa?: string;
      texto: string;
      origem: OrigemVaga;
    }): Promise<Vaga> => {
      const novaVaga = await jobRepo.criarEAdicionar(input);
      const atualizadas = await jobRepo.listarTodas('aluno');
      setTodasVagas(atualizadas);
      setVagaSelecionadaId(novaVaga.id);
      await preferencesRepo.salvarVagaSelecionadaId(novaVaga.id);
      return novaVaga;
    },
    [jobRepo, preferencesRepo],
  );

  const removerVaga = useCallback(
    async (id: string) => {
      await jobRepo.remover(id);
      const atualizadas = await jobRepo.listarTodas('aluno');
      setTodasVagas(atualizadas);

      if (vagaSelecionadaId === id) {
        const proximoId = atualizadas[0]?.id ?? null;
        setVagaSelecionadaId(proximoId);
        await preferencesRepo.salvarVagaSelecionadaId(proximoId);
      }
    },
    [jobRepo, preferencesRepo, vagaSelecionadaId],
  );

  const alternarEtapaPlano = useCallback(
    async (etapaId: string, concluida: boolean) => {
      setProgressoMap((prev) => ({
        ...prev,
        [etapaId]: concluida,
      }));
      await flightPlanRepo.definir(etapaId, concluida);
    },
    [flightPlanRepo],
  );

  const isCurriculoExemplo = textoCurriculo.trim() === CURRICULO_EXEMPLO_TEXTO.trim();

  const value = useMemo<AppDataContextValue>(
    () => ({
      perfil,
      curriculo,
      textoCurriculo,
      isCurriculoExemplo,
      todasVagas,
      vagasVisiveis,
      vagaSelecionadaId: vagaSelecionada?.id ?? vagaSelecionadaId,
      vagaSelecionada,
      progressoMap,
      alunos,
      carregando,
      salvandoCurriculo,
      erro,
      analiseCurriculo,
      vagasComDiagnostico,
      diagnosticoAtual,
      planoAtual,
      selecionarPerfil,
      selecionarVaga,
      atualizarTextoCurriculo,
      salvarCurriculoAgora,
      usarCurriculoExemplo,
      limparCurriculo,
      importarCurriculoTxt,
      adicionarVaga,
      removerVaga,
      alternarEtapaPlano,
      recarregarDados,
    }),
    [
      perfil,
      curriculo,
      textoCurriculo,
      isCurriculoExemplo,
      todasVagas,
      vagasVisiveis,
      vagaSelecionada,
      vagaSelecionadaId,
      progressoMap,
      alunos,
      carregando,
      salvandoCurriculo,
      erro,
      analiseCurriculo,
      vagasComDiagnostico,
      diagnosticoAtual,
      planoAtual,
      selecionarPerfil,
      selecionarVaga,
      atualizarTextoCurriculo,
      salvarCurriculoAgora,
      usarCurriculoExemplo,
      limparCurriculo,
      importarCurriculoTxt,
      adicionarVaga,
      removerVaga,
      alternarEtapaPlano,
      recarregarDados,
    ],
  );

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error('useAppData deve ser usado dentro de um AppDataProvider.');
  }
  return ctx;
}

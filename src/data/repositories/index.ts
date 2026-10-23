import {
  Aluno,
  AvaliadorDeCurriculo,
  Candidatura,
  Curriculo,
  ExtratorDeRequisitos,
  OrigemVaga,
  PerfilUsuario,
  Vaga,
  VagaInvalidaError,
} from '../../domain';
import { ALUNOS_EXEMPLO, VAGAS_EXEMPLO, criarCurriculoExemplo } from '../seed/seedData';
import { STORAGE_KEYS, localStorageService } from '../storage/localStorage';

let idCounter = 0;
export function gerarNovoId(prefixo = 'vaga'): string {
  idCounter += 1;
  return `${prefixo}_${Date.now().toString(36)}_${idCounter}`;
}

/**
 * Repositório de Currículo com persistência local no dispositivo (AsyncStorage).
 * Inicia com dados mockados e persiste qualquer edição do usuário entre sessões.
 */
export class CurriculumRepository {
  async obter(): Promise<Curriculo> {
    const salvo = await localStorageService.getJSON<Curriculo>(STORAGE_KEYS.CURRICULO);
    if (!salvo) {
      const exemplo = criarCurriculoExemplo();
      await this.salvar(exemplo);
      return exemplo;
    }
    return salvo;
  }

  async salvar(curriculo: Curriculo): Promise<void> {
    await localStorageService.setJSON(STORAGE_KEYS.CURRICULO, curriculo);
  }

  async salvarTexto(
    texto: string,
    nomeArquivo?: string,
    formatoOrigem?: 'pdf' | 'manual' | 'exemplo',
  ): Promise<Curriculo> {
    const avaliacao = AvaliadorDeCurriculo.avaliar(texto);
    const curriculo: Curriculo = {
      texto,
      palavras: avaliacao.totalPalavras,
      secoesDetectadas: avaliacao.secoesDetectadas,
      atualizadoEm: new Date().toISOString(),
      nomeArquivo,
      formatoOrigem: formatoOrigem || (nomeArquivo?.endsWith('.pdf') ? 'pdf' : 'manual'),
    };
    await this.salvar(curriculo);
    return curriculo;
  }

  async limpar(): Promise<Curriculo> {
    const vazio: Curriculo = {
      texto: '',
      palavras: 0,
      secoesDetectadas: {
        objetivo: false,
        formacao: false,
        projetos: false,
        habilidades: false,
        idiomas: false,
      },
      atualizadoEm: new Date().toISOString(),
    };
    await this.salvar(vazio);
    return vazio;
  }
}

/**
 * Repositório de Vagas com vagas mockadas (ex1, ex2, ex3) + vagas cadastradas localmente.
 */
export class JobRepository {
  async listarExemplos(): Promise<Vaga[]> {
    return [...VAGAS_EXEMPLO];
  }

  async listarPersonalizadas(): Promise<Vaga[]> {
    const salvas = await localStorageService.getJSON<Vaga[]>(STORAGE_KEYS.VAGAS_PERSONALIZADAS);
    return salvas ?? [];
  }

  async listarTodas(perfil: PerfilUsuario = 'aluno'): Promise<Vaga[]> {
    const exemplos = await this.listarExemplos();
    const personalizadas = await this.listarPersonalizadas();
    const todas = [...exemplos, ...personalizadas];

    if (perfil === 'aluno') {
      return todas;
    }
    return todas.filter((v) => v.origem !== 'aluno');
  }

  async obterPorId(id: string): Promise<Vaga | null> {
    const todas = await this.listarTodas('aluno');
    return todas.find((v) => v.id === id) || null;
  }

  async adicionar(vaga: Vaga): Promise<void> {
    const atuais = await this.listarPersonalizadas();
    atuais.unshift(vaga);
    await localStorageService.setJSON(STORAGE_KEYS.VAGAS_PERSONALIZADAS, atuais);
  }

  async criarEAdicionar(input: {
    titulo: string;
    empresa?: string;
    texto: string;
    origem: OrigemVaga;
    palavrasChave?: string[] | string;
  }): Promise<Vaga> {
    const titulo = input.titulo?.trim() || '';
    const texto = input.texto?.trim() || '';

    if (titulo.length < 3 || texto.length < 10) {
      throw new VagaInvalidaError();
    }

    const requisitos = ExtratorDeRequisitos.extrair(texto);

    let palavrasChave: string[] = [];
    if (Array.isArray(input.palavrasChave)) {
      palavrasChave = input.palavrasChave.map((k) => k.trim()).filter((k) => k.length > 0);
    } else if (typeof input.palavrasChave === 'string') {
      palavrasChave = input.palavrasChave
        .split(/[,;\n]/)
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
    }

    // Se nenhuma palavra-chave foi fornecida explicitamente, extrair dos requisitos
    if (palavrasChave.length === 0 && requisitos.length > 0) {
      palavrasChave = requisitos.map((r) => r.rotulo);
    }

    const vaga: Vaga = {
      id: gerarNovoId('vaga'),
      titulo,
      empresa: input.empresa?.trim() || (input.origem === 'aluno' ? 'Sua vaga' : 'Empresa'),
      descricao: texto,
      origem: input.origem,
      requisitos,
      palavrasChave,
    };

    await this.adicionar(vaga);
    return vaga;
  }

  async remover(id: string): Promise<void> {
    const vaga = await this.obterPorId(id);
    if (!vaga || vaga.origem === 'exemplo') {
      return;
    }
    const atuais = await this.listarPersonalizadas();
    const filtradas = atuais.filter((v) => v.id !== id);
    await localStorageService.setJSON(STORAGE_KEYS.VAGAS_PERSONALIZADAS, filtradas);
  }
}

/**
 * Repositório do Plano de Voo (Checklist interativo persistido localmente).
 */
export class FlightPlanRepository {
  async obter(): Promise<Record<string, boolean>> {
    const salvo = await localStorageService.getJSON<Record<string, boolean>>(
      STORAGE_KEYS.PROGRESSO_PLANO,
    );
    return salvo ?? {};
  }

  async definir(etapaId: string, concluida: boolean): Promise<Record<string, boolean>> {
    const atual = await this.obter();
    atual[etapaId] = concluida;
    await localStorageService.setJSON(STORAGE_KEYS.PROGRESSO_PLANO, atual);
    return atual;
  }
}

/**
 * Repositório de Preferências (Perfil ativo e vaga selecionada).
 */
export class PreferencesRepository {
  async obterPerfil(): Promise<PerfilUsuario> {
    const data = await localStorageService.getString(STORAGE_KEYS.PERFIL);
    if (data === 'teia' || data === 'empresa' || data === 'aluno') {
      return data;
    }
    return 'aluno';
  }

  async salvarPerfil(perfil: PerfilUsuario): Promise<void> {
    await localStorageService.setString(STORAGE_KEYS.PERFIL, perfil);
  }

  async obterVagaSelecionadaId(): Promise<string> {
    const data = await localStorageService.getString(STORAGE_KEYS.VAGA_SELECIONADA_ID);
    return data || 'ex1';
  }

  async salvarVagaSelecionadaId(id: string | null): Promise<void> {
    await localStorageService.setString(STORAGE_KEYS.VAGA_SELECIONADA_ID, id);
  }
}

/**
 * Repositório de Alunos do TEIA (dados demonstrativos mockados).
 */
export class StudentRepository {
  async listar(): Promise<Aluno[]> {
    return [...ALUNOS_EXEMPLO];
  }
}

export const curriculumRepository = new CurriculumRepository();
export const jobRepository = new JobRepository();
export const flightPlanRepository = new FlightPlanRepository();
export const preferencesRepository = new PreferencesRepository();
export const studentRepository = new StudentRepository();

/**
 * Repositório de Candidaturas persistidas no dispositivo.
 */
export class ApplicationRepository {
  async listar(): Promise<Candidatura[]> {
    const salvas = await localStorageService.getJSON<Candidatura[]>(STORAGE_KEYS.CANDIDATURAS);
    return salvas ?? [];
  }

  async obterPorVaga(vagaId: string): Promise<Candidatura[]> {
    const todas = await this.listar();
    return todas.filter((c) => c.vagaId === vagaId);
  }

  async candidatar(input: {
    vagaId: string;
    alunoId: string;
    alunoNome: string;
    compatibilidade: number | null;
  }): Promise<Candidatura> {
    const todas = await this.listar();
    const existente = todas.find(
      (c) => c.vagaId === input.vagaId && c.alunoId === input.alunoId,
    );
    if (existente) {
      return existente;
    }

    const nova: Candidatura = {
      id: gerarNovoId('cand'),
      vagaId: input.vagaId,
      alunoId: input.alunoId,
      alunoNome: input.alunoNome,
      criadaEm: new Date().toISOString(),
      compatibilidade: input.compatibilidade,
    };

    todas.unshift(nova);
    await localStorageService.setJSON(STORAGE_KEYS.CANDIDATURAS, todas);
    return nova;
  }

  async jaCandidatou(vagaId: string, alunoId: string): Promise<boolean> {
    const todas = await this.listar();
    return todas.some((c) => c.vagaId === vagaId && c.alunoId === alunoId);
  }
}

export const applicationRepository = new ApplicationRepository();

import {
  Aluno,
  AvaliadorDeCurriculo,
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

  async salvarTexto(texto: string): Promise<Curriculo> {
    const avaliacao = AvaliadorDeCurriculo.avaliar(texto);
    const curriculo: Curriculo = {
      texto,
      palavras: avaliacao.totalPalavras,
      secoesDetectadas: avaliacao.secoesDetectadas,
      atualizadoEm: new Date().toISOString(),
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
  }): Promise<Vaga> {
    const titulo = input.titulo?.trim() || '';
    const texto = input.texto?.trim() || '';

    if (titulo.length < 3 || texto.length < 10) {
      throw new VagaInvalidaError();
    }

    const requisitos = ExtratorDeRequisitos.extrair(texto);
    const vaga: Vaga = {
      id: gerarNovoId('vaga'),
      titulo,
      empresa: input.empresa?.trim() || (input.origem === 'aluno' ? 'Sua vaga' : 'Empresa'),
      descricao: texto,
      origem: input.origem,
      requisitos,
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

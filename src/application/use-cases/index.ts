import {
  AlunoRankeado,
  AvaliadorDeCurriculo,
  CalculadoraDeAderencia,
  Curriculo,
  Diagnostico,
  ExtratorDeRequisitos,
  GeradorDePlano,
  OrigemVaga,
  PlanoDeVoo,
  RankeadorDeAlunos,
  Vaga,
  VagaInvalidaError,
} from '../../domain';
import {
  AlunoRepository,
  AnalisadorComIA,
  CurriculoRepository,
  GeradorDeId,
  PerfilUsuario,
  ProgressoDoPlanoRepository,
  VagaRepository,
} from '../ports/out';

export class ObterCurriculo {
  constructor(private readonly curriculoRepo: CurriculoRepository) {}

  async execute(): Promise<Curriculo | null> {
    return this.curriculoRepo.obter();
  }
}

export class SalvarCurriculo {
  constructor(private readonly curriculoRepo: CurriculoRepository) {}

  async execute(texto: string): Promise<Curriculo> {
    const avaliacao = AvaliadorDeCurriculo.avaliar(texto);
    const curriculo: Curriculo = {
      texto,
      palavras: avaliacao.totalPalavras,
      secoesDetectadas: avaliacao.secoesDetectadas,
      atualizadoEm: new Date().toISOString(),
    };
    await this.curriculoRepo.salvar(curriculo);
    return curriculo;
  }
}

export class LimparCurriculo {
  constructor(private readonly curriculoRepo: CurriculoRepository) {}

  async execute(): Promise<void> {
    await this.curriculoRepo.limpar();
  }
}

export class ListarVagas {
  constructor(private readonly vagaRepo: VagaRepository) {}

  async execute(input: { perfil: PerfilUsuario }): Promise<Vaga[]> {
    const exemplos = await this.vagaRepo.listarExemplos();
    const personalizadas = await this.vagaRepo.listarPersonalizadas();
    const todas = [...exemplos, ...personalizadas];

    // Aluno vê todas as vagas; TEIA e empresa não veem as coladas por alunos
    if (input.perfil === 'aluno') {
      return todas;
    }
    return todas.filter((v) => v.origem !== 'aluno');
  }
}

export class AdicionarVaga {
  constructor(
    private readonly vagaRepo: VagaRepository,
    private readonly geradorDeId: GeradorDeId,
  ) {}

  async execute(input: {
    titulo: string;
    empresa?: string;
    texto: string;
    origem: OrigemVaga;
  }): Promise<Vaga> {
    const titulo = input.titulo?.trim() || '';
    const texto = input.texto?.trim() || '';

    // Validação: título e texto com no mínimo 10 caracteres
    if (titulo.length < 3 || texto.length < 10) {
      throw new VagaInvalidaError();
    }

    const requisitos = ExtratorDeRequisitos.extrair(texto);
    const vaga: Vaga = {
      id: this.geradorDeId.novo(),
      titulo,
      empresa: input.empresa?.trim() || (input.origem === 'aluno' ? 'Sua vaga' : 'Empresa'),
      descricao: texto,
      origem: input.origem,
      requisitos,
    };

    await this.vagaRepo.adicionar(vaga);
    return vaga;
  }
}

export class RemoverVaga {
  constructor(private readonly vagaRepo: VagaRepository) {}

  async execute(id: string): Promise<void> {
    const vaga = await this.vagaRepo.obterPorId(id);
    if (vaga && vaga.origem !== 'exemplo') {
      await this.vagaRepo.remover(id);
    }
  }
}

export class DiagnosticarCurriculo {
  constructor(
    private readonly curriculoRepo: CurriculoRepository,
    private readonly vagaRepo: VagaRepository,
  ) {}

  async execute(input: { vagaId: string }): Promise<Diagnostico> {
    const vaga = await this.vagaRepo.obterPorId(input.vagaId);
    if (!vaga) {
      throw new Error(`Vaga com id "${input.vagaId}" não encontrada.`);
    }
    const curriculo = await this.curriculoRepo.obter();
    const textoCurriculo = curriculo ? curriculo.texto : '';
    return CalculadoraDeAderencia.calcular(textoCurriculo, vaga, 'basica');
  }
}

export class RefinarComIA {
  constructor(
    private readonly curriculoRepo: CurriculoRepository,
    private readonly vagaRepo: VagaRepository,
    private readonly analisadorIA: AnalisadorComIA,
  ) {}

  async execute(input: { vagaId: string }): Promise<Diagnostico> {
    if (!this.analisadorIA.disponivel()) {
      throw new Error('Análise com IA indisponível no momento.');
    }
    const vaga = await this.vagaRepo.obterPorId(input.vagaId);
    if (!vaga) {
      throw new Error(`Vaga com id "${input.vagaId}" não encontrada.`);
    }
    const curriculo = await this.curriculoRepo.obter();
    const textoCurriculo = curriculo ? curriculo.texto : '';
    return this.analisadorIA.analisar(textoCurriculo, vaga);
  }
}

export class ObterPlanoDeVoo {
  constructor(
    private readonly curriculoRepo: CurriculoRepository,
    private readonly vagaRepo: VagaRepository,
    private readonly progressoRepo: ProgressoDoPlanoRepository,
  ) {}

  async execute(input: { vagaId: string }): Promise<PlanoDeVoo> {
    const vaga = await this.vagaRepo.obterPorId(input.vagaId);
    if (!vaga) {
      throw new Error(`Vaga com id "${input.vagaId}" não encontrada.`);
    }
    const curriculo = await this.curriculoRepo.obter();
    const textoCurriculo = curriculo ? curriculo.texto : '';
    const diag = CalculadoraDeAderencia.calcular(textoCurriculo, vaga);
    const progressoMap = await this.progressoRepo.obter();
    return GeradorDePlano.gerar(diag, progressoMap);
  }
}

export class AlternarEtapaDoPlano {
  constructor(private readonly progressoRepo: ProgressoDoPlanoRepository) {}

  async execute(input: { etapaId: string; concluida: boolean }): Promise<void> {
    await this.progressoRepo.definir(input.etapaId, input.concluida);
  }
}

export class RankearAlunosParaVaga {
  constructor(
    private readonly alunoRepo: AlunoRepository,
    private readonly vagaRepo: VagaRepository,
  ) {}

  async execute(input: { vagaId: string; aderenciaMinima?: number }): Promise<AlunoRankeado[]> {
    const vaga = await this.vagaRepo.obterPorId(input.vagaId);
    if (!vaga) {
      throw new Error(`Vaga com id "${input.vagaId}" não encontrada.`);
    }
    const alunos = await this.alunoRepo.listar();
    return RankeadorDeAlunos.rankear(alunos, vaga, input.aderenciaMinima ?? 60);
  }
}

export interface ResumoPainelTEIA {
  cadastrados: number;
  comCurriculo: number;
  aderenciaMedia: number;
}

export class ResumirPainelDoTEIA {
  constructor(
    private readonly alunoRepo: AlunoRepository,
    private readonly vagaRepo: VagaRepository,
  ) {}

  async execute(input: { vagaId: string }): Promise<ResumoPainelTEIA> {
    const vaga = await this.vagaRepo.obterPorId(input.vagaId);
    if (!vaga) {
      throw new Error(`Vaga com id "${input.vagaId}" não encontrada.`);
    }
    const alunos = await this.alunoRepo.listar();
    const cadastrados = alunos.length;
    const alunosComCurriculo = alunos.filter(
      (a) => a.curriculoTexto && a.curriculoTexto.trim().length > 0,
    );
    const comCurriculo = alunosComCurriculo.length;

    if (comCurriculo === 0 || vaga.requisitos.length === 0) {
      return { cadastrados, comCurriculo, aderenciaMedia: 0 };
    }

    let somaAderencias = 0;
    let countValidos = 0;
    for (const a of alunosComCurriculo) {
      const diag = CalculadoraDeAderencia.calcular(a.curriculoTexto, vaga);
      if (diag.aderencia !== null) {
        somaAderencias += diag.aderencia;
        countValidos++;
      }
    }

    const aderenciaMedia =
      countValidos === 0 ? 0 : Math.round(somaAderencias / countValidos);

    return {
      cadastrados,
      comCurriculo,
      aderenciaMedia,
    };
  }
}

export interface ContagemCompatibilidadeVaga {
  vagaId: string;
  compativeis: number;
  total: number;
}

export class ContarAlunosCompativeis {
  constructor(
    private readonly alunoRepo: AlunoRepository,
    private readonly vagaRepo: VagaRepository,
  ) {}

  async execute(input?: {
    aderenciaMinima?: number;
  }): Promise<Record<string, ContagemCompatibilidadeVaga>> {
    const minimo = input?.aderenciaMinima ?? 60;
    const alunos = await this.alunoRepo.listar();
    const total = alunos.length;

    const vagasExemplo = await this.vagaRepo.listarExemplos();
    const vagasPersonalizadas = await this.vagaRepo.listarPersonalizadas();
    const todasVagas = [...vagasExemplo, ...vagasPersonalizadas];

    const resultado: Record<string, ContagemCompatibilidadeVaga> = {};

    for (const vaga of todasVagas) {
      const rankeados = RankeadorDeAlunos.rankear(alunos, vaga, minimo);
      const compativeis = rankeados.filter((r) => r.compativel).length;
      resultado[vaga.id] = {
        vagaId: vaga.id,
        compativeis,
        total,
      };
    }

    return resultado;
  }
}

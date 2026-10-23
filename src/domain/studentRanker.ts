import { CalculadoraDeAderencia } from './adherenceCalculator';
import {
  Aluno,
  AlunoRankeado,
  ContagemCompatibilidadeVaga,
  ResumoPainelTEIA,
  Vaga,
} from './models';

export class RankeadorDeAlunos {
  static rankear(
    alunos: Aluno[],
    vaga: Vaga,
    aderenciaMinima = 60,
  ): AlunoRankeado[] {
    const rankeados: AlunoRankeado[] = alunos.map((aluno) => {
      const temCurriculo = Boolean(aluno.curriculoTexto && aluno.curriculoTexto.trim());
      if (!temCurriculo) {
        return {
          aluno,
          aderencia: null,
          compativel: false,
          faltam: [],
        };
      }

      const diagnostico = CalculadoraDeAderencia.calcular(aluno.curriculoTexto, vaga);
      const aderencia = diagnostico.aderencia;
      const compativel = aderencia !== null && aderencia >= aderenciaMinima;
      const faltam = diagnostico.requisitosFaltantes.slice(0, 3).map((f) => f.requisito.rotulo);

      return {
        aluno,
        aderencia,
        compativel,
        faltam,
      };
    });

    return rankeados.sort((a, b) => {
      if (a.aderencia === null && b.aderencia === null) return 0;
      if (a.aderencia === null) return 1;
      if (b.aderencia === null) return -1;
      return b.aderencia - a.aderencia;
    });
  }

  static resumirPainel(alunos: Aluno[], vaga: Vaga): ResumoPainelTEIA {
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

    const aderenciaMedia = countValidos === 0 ? 0 : Math.round(somaAderencias / countValidos);

    return {
      cadastrados,
      comCurriculo,
      aderenciaMedia,
    };
  }

  static contarCompativeisPorVaga(
    alunos: Aluno[],
    vagas: Vaga[],
    aderenciaMinima = 60,
  ): Record<string, ContagemCompatibilidadeVaga> {
    const total = alunos.length;
    const resultado: Record<string, ContagemCompatibilidadeVaga> = {};

    for (const vaga of vagas) {
      const rankeados = this.rankear(alunos, vaga, aderenciaMinima);
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

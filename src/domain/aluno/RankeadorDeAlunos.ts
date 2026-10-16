import { CalculadoraDeAderencia } from '../diagnostico/CalculadoraDeAderencia';
import { Vaga } from '../vaga/Vaga';
import { Aluno, AlunoRankeado } from './Aluno';

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

    // Ordenação estável: aderência decrescente, nulos por último, empates mantêm a ordem original
    return rankeados.sort((a, b) => {
      if (a.aderencia === null && b.aderencia === null) return 0;
      if (a.aderencia === null) return 1;
      if (b.aderencia === null) return -1;
      return b.aderencia - a.aderencia;
    });
  }
}

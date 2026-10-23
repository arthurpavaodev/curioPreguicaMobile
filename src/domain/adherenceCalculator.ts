import { AvaliadorDeCurriculo, VerificadorOrtografico } from './curriculumEvaluator';
import {
  Diagnostico,
  NivelDeAderencia,
  Requisito,
  RequisitoAtendido,
  RequisitoFaltante,
  Vaga,
} from './models';
import { contemTermo, normalizarTexto } from './textNormalizer';

export function obterNivelDeAderencia(aderencia: number | null): NivelDeAderencia {
  if (aderencia === null) {
    return {
      tipo: 'sem_requisitos',
      rotulo: 'Sem requisitos reconhecidos',
    };
  }

  if (aderencia >= 75) {
    return {
      tipo: 'boa',
      rotulo: 'Boa aderência',
    };
  }

  if (aderencia >= 45) {
    return {
      tipo: 'parcial',
      rotulo: 'Aderência parcial',
    };
  }

  return {
    tipo: 'baixa',
    rotulo: 'Baixa aderência',
  };
}

export class CalculadoraDeAderencia {
  static calcular(
    textoCurriculo: string,
    vaga: Vaga,
    origemAnalise: 'basica' | 'ia' = 'basica',
  ): Diagnostico {
    const curriculoNormalizado = normalizarTexto(textoCurriculo);
    const linhasCurriculo = (textoCurriculo || '').split(/\r?\n/);

    const requisitosAtendidos: RequisitoAtendido[] = [];
    const requisitosFaltantes: RequisitoFaltante[] = [];

    let somaPesosAtendidos = 0;
    let somaPesosTotal = 0;

    for (const req of vaga.requisitos) {
      somaPesosTotal += req.peso;
      const { atendido, evidencia } = this.verificarRequisito(
        req,
        curriculoNormalizado,
        linhasCurriculo,
      );

      if (atendido) {
        somaPesosAtendidos += req.peso;
        requisitosAtendidos.push({
          requisito: req,
          evidencia,
        });
      } else {
        requisitosFaltantes.push({
          requisito: req,
          obrigatorio: req.peso === 2,
          acaoSugerida: this.gerarAcaoSugerida(req),
        });
      }
    }

    // Processamento de palavras-chave da vaga
    const palavrasChave = vaga.palavrasChave || [];
    const palavrasAtendidas: string[] = [];
    const palavrasFaltantes: string[] = [];

    if (palavrasChave.length > 0 && curriculoNormalizado) {
      for (const pc of palavrasChave) {
        const pcNorm = normalizarTexto(pc);
        if (contemTermo(curriculoNormalizado, pcNorm)) {
          palavrasAtendidas.push(pc);
        } else {
          palavrasFaltantes.push(pc);
        }
      }
    }

    let aderencia: number | null = null;
    if (vaga.requisitos.length > 0) {
      aderencia = Math.round((100 * somaPesosAtendidos) / somaPesosTotal);
    } else if (palavrasChave.length > 0) {
      aderencia = Math.round((100 * palavrasAtendidas.length) / palavrasChave.length);
    }

    const avaliacao = AvaliadorDeCurriculo.avaliar(textoCurriculo);
    const ortografia = VerificadorOrtografico.verificar(textoCurriculo);

    return {
      vagaId: vaga.id,
      aderencia,
      nivel: obterNivelDeAderencia(aderencia),
      totalRequisitos: vaga.requisitos.length > 0 ? vaga.requisitos.length : palavrasChave.length,
      requisitosAtendidosCount: vaga.requisitos.length > 0 ? requisitosAtendidos.length : palavrasAtendidas.length,
      requisitosAtendidos,
      requisitosFaltantes,
      palavrasChave,
      palavrasAtendidas,
      palavrasFaltantes,
      pontosFortes: avaliacao.pontosFortes,
      pontosFracos: avaliacao.pontosFracos,
      ortografia,
      origemAnalise,
    };
  }

  static calcularPorPalavrasChave(
    textoCurriculo: string,
    palavrasChave: string[],
  ): {
    aderencia: number | null;
    palavrasAtendidas: string[];
    palavrasFaltantes: string[];
    total: number;
  } {
    if (!palavrasChave || palavrasChave.length === 0) {
      return { aderencia: null, palavrasAtendidas: [], palavrasFaltantes: [], total: 0 };
    }

    const norm = normalizarTexto(textoCurriculo || '');
    if (!norm) {
      return {
        aderencia: 0,
        palavrasAtendidas: [],
        palavrasFaltantes: [...palavrasChave],
        total: palavrasChave.length,
      };
    }

    const atendidas: string[] = [];
    const faltantes: string[] = [];

    for (const pc of palavrasChave) {
      const pcNorm = normalizarTexto(pc);
      if (contemTermo(norm, pcNorm)) {
        atendidas.push(pc);
      } else {
        faltantes.push(pc);
      }
    }

    const aderencia = Math.round((100 * atendidas.length) / palavrasChave.length);
    return {
      aderencia,
      palavrasAtendidas: atendidas,
      palavrasFaltantes: faltantes,
      total: palavrasChave.length,
    };
  }

  private static verificarRequisito(
    req: Requisito,
    curriculoNormalizado: string,
    linhasCurriculo: string[],
  ): { atendido: boolean; evidencia: string } {
    if (!curriculoNormalizado) {
      return { atendido: false, evidencia: '' };
    }

    if (req.tipo === 'generico') {
      const tokens = req.tokensGenericos || [];
      if (tokens.length === 0) return { atendido: false, evidencia: '' };

      let presentes = 0;
      for (const t of tokens) {
        if (contemTermo(curriculoNormalizado, t)) {
          presentes++;
        }
      }

      const atendido = presentes / tokens.length >= 0.5;
      return {
        atendido,
        evidencia: atendido ? 'Termos do requisito aparecem no currículo.' : '',
      };
    }

    for (const comp of req.competencias) {
      for (const alias of comp.aliases) {
        const aliasNorm = normalizarTexto(alias);
        if (contemTermo(curriculoNormalizado, aliasNorm)) {
          const evidencia = this.extrairEvidenciaLinha(linhasCurriculo, aliasNorm);
          return { atendido: true, evidencia };
        }
      }
    }

    return { atendido: false, evidencia: '' };
  }

  private static extrairEvidenciaLinha(linhas: string[], aliasNorm: string): string {
    for (const linha of linhas) {
      const linhaSemMarcador = linha.replace(/^[\s\-•*·]+/, '').trim();
      const norm = normalizarTexto(linhaSemMarcador);
      if (contemTermo(norm, aliasNorm)) {
        if (linhaSemMarcador.length > 90) {
          return linhaSemMarcador.slice(0, 90) + '…';
        }
        return linhaSemMarcador;
      }
    }
    return 'Termo do requisito identificado no currículo.';
  }

  static gerarAcaoSugerida(req: Requisito): string {
    if (req.tipo === 'generico') {
      const texto = req.textoOriginal || req.rotulo;
      return `Mostre no currículo, com um exemplo concreto, que você atende: "${texto}".`;
    }

    const primeiraComp = req.competencias[0];
    const tipo = primeiraComp?.tipo || 'tech';

    if (tipo === 'idioma') {
      return 'Pratique leitura técnica em inglês (documentação, artigos) e informe no currículo o seu nível real.';
    }

    if (tipo === 'soft') {
      const rotuloLower = req.rotulo.toLowerCase();
      return `Descreva uma situação real (projeto, monitoria, trabalho em grupo) que mostre ${rotuloLower}, com o que você fez e o resultado.`;
    }

    return `Estude os fundamentos de ${req.rotulo}, faça um projeto pequeno e publique no GitHub. Depois cite o projeto no currículo.`;
  }
}

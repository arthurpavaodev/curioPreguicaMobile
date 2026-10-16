import { contemTermo, normalizarTexto } from '../competencia/normalizarTexto';
import { AvaliadorDeCurriculo } from '../curriculo/AvaliadorDeCurriculo';
import { VerificadorOrtografico } from '../curriculo/VerificadorOrtografico';
import { Requisito } from '../vaga/Requisito';
import { Vaga } from '../vaga/Vaga';
import { Diagnostico, RequisitoAtendido, RequisitoFaltante } from './Diagnostico';
import { obterNivelDeAderencia } from './NivelDeAderencia';

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

    const aderencia =
      vaga.requisitos.length === 0
        ? null
        : Math.round((100 * somaPesosAtendidos) / somaPesosTotal);

    const avaliacao = AvaliadorDeCurriculo.avaliar(textoCurriculo);
    const ortografia = VerificadorOrtografico.verificar(textoCurriculo);

    return {
      vagaId: vaga.id,
      aderencia,
      nivel: obterNivelDeAderencia(aderencia),
      totalRequisitos: vaga.requisitos.length,
      requisitosAtendidosCount: requisitosAtendidos.length,
      requisitosAtendidos,
      requisitosFaltantes,
      pontosFortes: avaliacao.pontosFortes,
      pontosFracos: avaliacao.pontosFracos,
      ortografia,
      origemAnalise,
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

    // Para competência ou grupo: verifica se qualquer alias de qualquer competência está no currículo
    for (const comp of req.competencias) {
      for (const alias of comp.aliases) {
        const aliasNorm = normalizarTexto(alias);
        if (contemTermo(curriculoNormalizado, aliasNorm)) {
          // Busca a primeira linha do currículo com esse alias para servir de evidência
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

    // Tech default
    return `Estude os fundamentos de ${req.rotulo}, faça um projeto pequeno e publique no GitHub. Depois cite o projeto no currículo.`;
  }
}

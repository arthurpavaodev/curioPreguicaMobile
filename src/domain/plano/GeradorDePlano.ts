import { Diagnostico } from '../diagnostico/Diagnostico';
import { EtapaDoPlano } from './EtapaDoPlano';
import { PlanoDeVoo } from './PlanoDeVoo';

export function gerarIdEtapa(vagaId: string, titulo: string, detalhe: string): string {
  const chave = `${vagaId}|${titulo}|${detalhe}`;
  let hash = 0;
  for (let i = 0; i < chave.length; i++) {
    const char = chave.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `etapa_${Math.abs(hash).toString(36)}`;
}

export class GeradorDePlano {
  static gerar(
    diagnostico: Diagnostico,
    progressoMap: Record<string, boolean> = {},
  ): PlanoDeVoo {
    const etapas: EtapaDoPlano[] = [];
    const vagaId = diagnostico.vagaId;

    // 1. Grupo currículo (se houver requisitos atendidos)
    if (diagnostico.requisitosAtendidos.length > 0) {
      const rotulos = diagnostico.requisitosAtendidos
        .slice(0, 4)
        .map((r) => r.requisito.rotulo)
        .join(', ');
      const titulo = 'Adaptar o currículo a esta vaga';
      const detalhe = `Coloque no topo, na seção de habilidades, o que a vaga pede e você já tem: ${rotulos}.`;
      etapas.push({
        id: gerarIdEtapa(vagaId, titulo, detalhe),
        vagaId,
        grupo: 'curriculo',
        titulo,
        detalhe,
        concluida: false,
      });
    }

    // 2. Grupo currículo (se houver erro de ortografia)
    if (diagnostico.ortografia.length > 0) {
      const itensOrtografia = diagnostico.ortografia
        .slice(0, 5)
        .map((item) => item.rotulo)
        .join('; ');
      const titulo = 'Corrigir a ortografia';
      const detalhe = itensOrtografia;
      etapas.push({
        id: gerarIdEtapa(vagaId, titulo, detalhe),
        vagaId,
        grupo: 'curriculo',
        titulo,
        detalhe,
        concluida: false,
      });
    }

    // 3. Grupo currículo (até 4 etapas "Melhorar o currículo")
    const pontosFracos = diagnostico.pontosFracos.slice(0, 4);
    for (const ponto of pontosFracos) {
      const titulo = 'Melhorar o currículo';
      const detalhe = ponto;
      etapas.push({
        id: gerarIdEtapa(vagaId, titulo, detalhe),
        vagaId,
        grupo: 'curriculo',
        titulo,
        detalhe,
        concluida: false,
      });
    }

    // 4. Grupo competências (uma etapa por requisito que falta, ordenadas por peso)
    // Obrigatórios (peso 2) antes dos diferenciais (peso 1)
    const faltantesOrdenados = [...diagnostico.requisitosFaltantes].sort(
      (a, b) => b.requisito.peso - a.requisito.peso,
    );

    for (const faltante of faltantesOrdenados) {
      const sufixoDiferencial = faltante.requisito.peso === 1 ? ' (diferencial)' : '';
      const titulo = `Desenvolver: ${faltante.requisito.rotulo}${sufixoDiferencial}`;
      const detalhe = faltante.acaoSugerida;
      etapas.push({
        id: gerarIdEtapa(vagaId, titulo, detalhe),
        vagaId,
        grupo: 'competencias',
        titulo,
        detalhe,
        concluida: false,
      });
    }

    // Aplica o progresso salvo
    let concluidasCount = 0;
    for (const etapa of etapas) {
      if (progressoMap[etapa.id]) {
        etapa.concluida = true;
        concluidasCount++;
      }
    }

    const totalEtapas = etapas.length;
    const progresso = totalEtapas === 0 ? 0 : Math.round((100 * concluidasCount) / totalEtapas);

    return {
      vagaId,
      etapas,
      concluidasCount,
      totalEtapas,
      progresso,
    };
  }
}

import { useCallback, useEffect, useState } from 'react';
import { PlanoDeVoo } from '../../../../domain';
import { useContainer } from '../../../../main';

export function usePlano(vagaId: string | null) {
  const container = useContainer();
  const [plano, setPlano] = useState<PlanoDeVoo | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!vagaId) {
      setPlano(null);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);
      const p = await container.obterPlanoDeVoo.execute({ vagaId });
      setPlano(p);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao obter plano de voo');
    } finally {
      setCarregando(false);
    }
  }, [container, vagaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const alternarEtapa = useCallback(
    async (etapaId: string, concluida: boolean) => {
      try {
        await container.alternarEtapaDoPlano.execute({ etapaId, concluida });
        // Atualiza estado local imediatamente para feedback reativo
        setPlano((prev) => {
          if (!prev) return prev;
          const etapasAtualizadas = prev.etapas.map((e) =>
            e.id === etapaId ? { ...e, concluida } : e,
          );
          const concluidasCount = etapasAtualizadas.filter((e) => e.concluida).length;
          const totalEtapas = etapasAtualizadas.length;
          const progresso =
            totalEtapas === 0 ? 0 : Math.round((100 * concluidasCount) / totalEtapas);

          return {
            ...prev,
            etapas: etapasAtualizadas,
            concluidasCount,
            progresso,
          };
        });
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao alternar etapa');
      }
    },
    [container],
  );

  return {
    plano,
    carregando,
    erro,
    alternarEtapa,
    recarregar: carregar,
  };
}

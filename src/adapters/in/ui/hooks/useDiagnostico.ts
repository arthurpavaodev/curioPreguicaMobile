import { useCallback, useEffect, useState } from 'react';
import { Diagnostico } from '../../../../domain';
import { useContainer } from '../../../../main';

export function useDiagnostico(vagaId: string | null) {
  const container = useContainer();
  const [diagnostico, setDiagnostico] = useState<Diagnostico | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const podeRefinarComIA = container.analisadorIA.disponivel();

  const carregar = useCallback(async () => {
    if (!vagaId) {
      setDiagnostico(null);
      setCarregando(false);
      return;
    }

    try {
      setCarregando(true);
      setErro(null);
      const diag = await container.diagnosticarCurriculo.execute({ vagaId });
      setDiagnostico(diag);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao gerar diagnóstico');
    } finally {
      setCarregando(false);
    }
  }, [container, vagaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const refinarComIA = useCallback(async () => {
    if (!vagaId || !podeRefinarComIA) return;

    try {
      setCarregando(true);
      setErro(null);
      const diag = await container.refinarComIA.execute({ vagaId });
      setDiagnostico(diag);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao refinar diagnóstico com IA');
    } finally {
      setCarregando(false);
    }
  }, [container, vagaId, podeRefinarComIA]);

  return {
    diagnostico,
    carregando,
    erro,
    podeRefinarComIA,
    refinarComIA,
    recarregar: carregar,
  };
}

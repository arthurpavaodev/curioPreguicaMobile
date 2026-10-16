import { useCallback, useEffect, useState } from 'react';
import { AlunoRankeado, Vaga } from '../../../../domain';
import { ContagemCompatibilidadeVaga, ResumoPainelTEIA } from '../../../../application';
import { useContainer } from '../../../../main';

export function useTEIA(vagaSelecionadaId: string | null) {
  const container = useContainer();
  const [resumo, setResumo] = useState<ResumoPainelTEIA | null>(null);
  const [ranking, setRanking] = useState<AlunoRankeado[]>([]);
  const [oportunidades, setOportunidades] = useState<Record<string, ContagemCompatibilidadeVaga>>({});
  const [vagas, setVagas] = useState<Vaga[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const listaVagas = await container.listarVagas.execute({ perfil: 'teia' });
      setVagas(listaVagas);

      const contagem = await container.contarAlunosCompativeis.execute({ aderenciaMinima: 60 });
      setOportunidades(contagem);

      if (vagaSelecionadaId) {
        const res = await container.resumirPainelDoTEIA.execute({ vagaId: vagaSelecionadaId });
        setResumo(res);

        const rnk = await container.rankearAlunosParaVaga.execute({
          vagaId: vagaSelecionadaId,
          aderenciaMinima: 60,
        });
        setRanking(rnk);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar dados do TEIA');
    } finally {
      setCarregando(false);
    }
  }, [container, vagaSelecionadaId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return {
    resumo,
    ranking,
    oportunidades,
    vagas,
    carregando,
    erro,
    recarregar: carregar,
  };
}

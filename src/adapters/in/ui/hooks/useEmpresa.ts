import { useCallback, useEffect, useState } from 'react';
import { AlunoRankeado, CalculadoraDeAderencia, Vaga } from '../../../../domain';
import { useContainer } from '../../../../main';

export function useEmpresa(vagaSelecionadaId: string | null) {
  const container = useContainer();
  const [vagasEmpresa, setVagasEmpresa] = useState<Vaga[]>([]);
  const [todasVagas, setTodasVagas] = useState<Vaga[]>([]);
  const [candidatos, setCandidatos] = useState<AlunoRankeado[]>([]);
  const [aderenciaMinima, setAderenciaMinima] = useState<number>(60);
  const [aderenciaUsuario, setAderenciaUsuario] = useState<number | null>(null);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const todas = await container.listarVagas.execute({ perfil: 'empresa' });
      setTodasVagas(todas);
      // Vagas publicadas pela empresa (ou exemplos)
      const daEmpresa = todas.filter((v) => v.origem === 'empresa' || v.origem === 'exemplo');
      setVagasEmpresa(daEmpresa);

      if (vagaSelecionadaId) {
        const ranking = await container.rankearAlunosParaVaga.execute({
          vagaId: vagaSelecionadaId,
          aderenciaMinima,
        });
        // Apenas alunos que atingem o mínimo
        const filtrados = ranking.filter(
          (r) => r.aderencia !== null && r.aderencia >= aderenciaMinima,
        );
        setCandidatos(filtrados);

        // Aderência que o currículo do próprio usuário teria na vaga
        const vagaAtual = todas.find((v) => v.id === vagaSelecionadaId);
        if (vagaAtual) {
          const curriculo = await container.obterCurriculo.execute();
          const diag = CalculadoraDeAderencia.calcular(curriculo?.texto || '', vagaAtual);
          setAderenciaUsuario(diag.aderencia);
        }
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar dados da empresa');
    } finally {
      setCarregando(false);
    }
  }, [container, vagaSelecionadaId, aderenciaMinima]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const criarVaga = useCallback(
    async (titulo: string, empresa: string, descricao: string) => {
      try {
        setCarregando(true);
        await container.adicionarVaga.execute({
          titulo,
          empresa,
          texto: descricao,
          origem: 'empresa',
        });
        await carregar();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao cadastrar vaga');
        throw e;
      } finally {
        setCarregando(false);
      }
    },
    [container, carregar],
  );

  const removerVaga = useCallback(
    async (id: string) => {
      try {
        setCarregando(true);
        await container.removerVaga.execute(id);
        await carregar();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao remover vaga');
      } finally {
        setCarregando(false);
      }
    },
    [container, carregar],
  );

  return {
    vagasEmpresa,
    todasVagas,
    candidatos,
    aderenciaMinima,
    aderenciaUsuario,
    carregando,
    erro,
    setAderenciaMinima,
    criarVaga,
    removerVaga,
    recarregar: carregar,
  };
}

import { useCallback, useEffect, useState } from 'react';
import { CalculadoraDeAderencia, OrigemVaga, Vaga } from '../../../../domain';
import { PerfilUsuario } from '../../../../application';
import { useContainer } from '../../../../main';

export interface VagaComAderencia {
  vaga: Vaga;
  aderencia: number | null;
}

export function useVagas(perfil: PerfilUsuario = 'aluno') {
  const container = useContainer();
  const [vagas, setVagas] = useState<VagaComAderencia[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);

      const listaVagas = await container.listarVagas.execute({ perfil });
      const curriculo = await container.obterCurriculo.execute();
      const textoCurriculo = curriculo ? curriculo.texto : '';

      const comAderencia: VagaComAderencia[] = listaVagas.map((vaga) => {
        const diag = CalculadoraDeAderencia.calcular(textoCurriculo, vaga);
        return {
          vaga,
          aderencia: diag.aderencia,
        };
      });

      setVagas(comAderencia);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao listar vagas');
    } finally {
      setCarregando(false);
    }
  }, [container, perfil]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const adicionarVaga = useCallback(
    async (titulo: string, empresa: string | undefined, texto: string, origem: OrigemVaga) => {
      try {
        setCarregando(true);
        await container.adicionarVaga.execute({
          titulo,
          empresa,
          texto,
          origem,
        });
        await carregar();
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao adicionar vaga');
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
    vagas,
    carregando,
    erro,
    adicionarVaga,
    removerVaga,
    recarregar: carregar,
  };
}

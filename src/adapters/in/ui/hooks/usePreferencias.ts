import { useCallback, useEffect, useState } from 'react';
import { PerfilUsuario } from '../../../../application';
import { useContainer } from '../../../../main';

export function usePreferencias() {
  const container = useContainer();
  const [perfil, setPerfil] = useState<PerfilUsuario>('aluno');
  const [vagaSelecionadaId, setVagaSelecionadaId] = useState<string | null>('ex1');
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    try {
      const p = await container.preferenciasRepo.obterPerfil();
      const v = await container.preferenciasRepo.obterVagaSelecionadaId();
      setPerfil(p);
      setVagaSelecionadaId(v || 'ex1');
    } finally {
      setCarregando(false);
    }
  }, [container]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const selecionarPerfil = useCallback(
    async (novoPerfil: PerfilUsuario) => {
      setPerfil(novoPerfil);
      await container.preferenciasRepo.salvarPerfil(novoPerfil);
    },
    [container],
  );

  const selecionarVaga = useCallback(
    async (novoVagaId: string) => {
      setVagaSelecionadaId(novoVagaId);
      await container.preferenciasRepo.salvarVagaSelecionadaId(novoVagaId);
    },
    [container],
  );

  return {
    perfil,
    vagaSelecionadaId,
    carregando,
    selecionarPerfil,
    selecionarVaga,
  };
}

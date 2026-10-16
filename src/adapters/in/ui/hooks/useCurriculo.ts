import { useCallback, useEffect, useRef, useState } from 'react';
import { Curriculo } from '../../../../domain';
import { useContainer } from '../../../../main';
import { CURRICULO_EXEMPLO_TEXTO } from '../../../out/seed/SeedData';

export function useCurriculo() {
  const container = useContainer();
  const [curriculo, setCurriculo] = useState<Curriculo | null>(null);
  const [texto, setTexto] = useState<string>('');
  const [carregando, setCarregando] = useState<boolean>(true);
  const [salvando, setSalvando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const carregar = useCallback(async () => {
    try {
      setCarregando(true);
      setErro(null);
      const c = await container.obterCurriculo.execute();
      setCurriculo(c);
      setTexto(c?.texto || '');
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar currículo');
    } finally {
      setCarregando(false);
    }
  }, [container]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Salva com debounce
  const atualizarTexto = useCallback(
    (novoTexto: string) => {
      setTexto(novoTexto);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          setSalvando(true);
          const c = await container.salvarCurriculo.execute(novoTexto);
          setCurriculo(c);
        } catch (e) {
          setErro(e instanceof Error ? e.message : 'Erro ao salvar currículo');
        } finally {
          setSalvando(false);
        }
      }, 400);
    },
    [container],
  );

  const usarExemplo = useCallback(async () => {
    try {
      setSalvando(true);
      setTexto(CURRICULO_EXEMPLO_TEXTO);
      const c = await container.salvarCurriculo.execute(CURRICULO_EXEMPLO_TEXTO);
      setCurriculo(c);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao carregar currículo de exemplo');
    } finally {
      setSalvando(false);
    }
  }, [container]);

  const limpar = useCallback(async () => {
    try {
      setSalvando(true);
      setTexto('');
      await container.limparCurriculo.execute();
      const c = await container.obterCurriculo.execute();
      setCurriculo(c);
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao limpar currículo');
    } finally {
      setSalvando(false);
    }
  }, [container]);

  const carregarDeArquivo = useCallback(async () => {
    try {
      setSalvando(true);
      const conteudo = await container.leitorArquivo.escolherEler();
      if (conteudo !== null) {
        setTexto(conteudo);
        const c = await container.salvarCurriculo.execute(conteudo);
        setCurriculo(c);
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : 'Erro ao ler arquivo .txt');
    } finally {
      setSalvando(false);
    }
  }, [container]);

  const isExemplo = texto.trim() === CURRICULO_EXEMPLO_TEXTO.trim();

  return {
    curriculo,
    texto,
    carregando,
    salvando,
    erro,
    isExemplo,
    atualizarTexto,
    usarExemplo,
    limpar,
    carregarDeArquivo,
    recarregar: carregar,
  };
}

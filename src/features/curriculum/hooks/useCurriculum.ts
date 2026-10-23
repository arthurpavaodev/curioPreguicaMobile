import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAppData } from '../../../app/providers/AppDataProvider';

export function useCurriculum() {
  const {
    curriculo,
    textoCurriculo,
    isCurriculoExemplo,
    analiseCurriculo,
    carregando,
    salvandoCurriculo,
    erro,
    atualizarTextoCurriculo,
    salvarCurriculoAgora,
    usarCurriculoExemplo,
    limparCurriculo,
    importarCurriculoPdf,
    importarCurriculoTxt,
  } = useAppData();

  useFocusEffect(
    useCallback(() => {
      return () => {
        // Garante que qualquer edição pendente no debounce seja salva ao sair da aba
        salvarCurriculoAgora();
      };
    }, [salvarCurriculoAgora]),
  );

  return {
    curriculo,
    texto: textoCurriculo,
    isExemplo: isCurriculoExemplo,
    analise: analiseCurriculo,
    carregando,
    salvando: salvandoCurriculo,
    erro,
    atualizarTexto: atualizarTextoCurriculo,
    salvarAgora: salvarCurriculoAgora,
    usarExemplo: usarCurriculoExemplo,
    limpar: limparCurriculo,
    importarPdf: importarCurriculoPdf,
    importarTxt: importarCurriculoTxt,
  };
}

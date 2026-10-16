import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tipografia } from '../theme/typography';

export type TipoAviso = 'info' | 'atencao' | 'erro' | 'ok';

export interface AvisoProps {
  mensagem: string;
  tipo?: TipoAviso;
  style?: ViewStyle;
}

export function Aviso({ mensagem, tipo = 'info', style }: AvisoProps) {
  const { cores } = useTheme();

  let fundo = cores.destaqueSuave;
  let borda = cores.destaque;
  let textoCor = cores.tinta;

  switch (tipo) {
    case 'atencao':
      fundo = cores.atencaoSuave;
      borda = cores.atencao;
      break;
    case 'erro':
      fundo = cores.erroSuave;
      borda = cores.erro;
      break;
    case 'ok':
      fundo = cores.okSuave;
      borda = cores.ok;
      break;
    case 'info':
    default:
      fundo = cores.isDark ? '#142533' : '#E8EFF5';
      borda = cores.textoSecundario;
      break;
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: fundo,
          borderLeftColor: borda,
        },
        style,
      ]}
      accessibilityRole="alert"
    >
      <Text style={[tipografia.apoio, { color: textoCor }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginVertical: 8,
  },
});

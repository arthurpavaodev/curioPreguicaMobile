import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tipografia } from '../theme/typography';

export type VarianteSelo = 'ok' | 'atencao' | 'erro' | 'destaque' | 'padrao';

export interface SeloProps {
  rotulo: string;
  variante?: VarianteSelo;
  style?: ViewStyle;
}

export function Selo({ rotulo, variante = 'padrao', style }: SeloProps) {
  const { cores } = useTheme();

  let fundo = cores.linha;
  let textoCor = cores.textoSecundario;

  switch (variante) {
    case 'ok':
      fundo = cores.okSuave;
      textoCor = cores.ok;
      break;
    case 'atencao':
      fundo = cores.atencaoSuave;
      textoCor = cores.atencao;
      break;
    case 'erro':
      fundo = cores.erroSuave;
      textoCor = cores.erro;
      break;
    case 'destaque':
      fundo = cores.destaqueSuave;
      textoCor = cores.destaque;
      break;
    case 'padrao':
    default:
      fundo = cores.linha;
      textoCor = cores.tinta;
      break;
  }

  return (
    <View
      style={[styles.badge, { backgroundColor: fundo }, style]}
      accessibilityRole="text"
      accessibilityLabel={rotulo}
    >
      <Text style={[tipografia.rotulo, { color: textoCor }]}>{rotulo}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
});

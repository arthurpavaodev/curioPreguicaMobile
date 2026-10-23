import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { fontNames, radius } from '../../theme';

export type BadgeVariant = 'padrao' | 'destaque' | 'ok' | 'atencao' | 'erro' | 'institucional';

export interface BadgeProps {
  rotulo: string;
  variante?: BadgeVariant;
  style?: StyleProp<ViewStyle>;
}

export function Badge({ rotulo, variante = 'padrao', style }: BadgeProps) {
  const { cores } = useTheme();

  const getStyleColors = () => {
    switch (variante) {
      case 'ok':
        return { bg: cores.okSuave, fg: cores.ok, border: 'transparent' };
      case 'atencao':
        return { bg: cores.atencaoSuave, fg: cores.atencao, border: 'transparent' };
      case 'erro':
        return { bg: cores.erroSuave, fg: cores.erro, border: 'transparent' };
      case 'destaque':
        return { bg: cores.destaqueSuave, fg: cores.destaque, border: 'transparent' };
      case 'institucional':
        return { bg: cores.institucional, fg: '#FFFFFF', border: 'transparent' };
      default:
        return { bg: cores.superficieSecundaria, fg: cores.textoSecundario, border: cores.linha };
    }
  };

  const { bg, fg, border } = getStyleColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border === 'transparent' ? 0 : 1,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color: fg }]} numberOfLines={1}>
        {rotulo}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontFamily: fontNames.plexMono600,
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '600',
  },
});

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { fontNames, radius, spacing } from '../../theme';

export type ButtonVariant = 'primario' | 'institucional' | 'padrao' | 'fantasma' | 'perigo';

export interface ButtonProps {
  titulo: string;
  onPress: () => void;
  variante?: ButtonVariant;
  compacto?: boolean;
  desabilitado?: boolean;
  carregando?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Button({
  titulo,
  onPress,
  variante = 'padrao',
  compacto = false,
  desabilitado = false,
  carregando = false,
  style,
  accessibilityLabel,
}: ButtonProps) {
  const { cores } = useTheme();
  const isDisabled = desabilitado || carregando;

  const getBackgroundColor = (pressed: boolean) => {
    if (isDisabled) return cores.linha;
    if (variante === 'primario') return pressed ? '#0035CC' : cores.destaque;
    if (variante === 'institucional') return pressed ? '#0D1B2A' : cores.institucionalSuave;
    if (variante === 'perigo') return pressed ? cores.erroSuave : 'transparent';
    if (variante === 'fantasma') return pressed ? cores.destaqueSuave : 'transparent';
    return pressed ? cores.superficieSecundaria : cores.superficie;
  };

  const getTextColor = () => {
    if (isDisabled) return cores.textoSecundario;
    if (variante === 'primario') return cores.destaqueTexto;
    if (variante === 'institucional') return '#FFFFFF';
    if (variante === 'perigo') return cores.erro;
    if (variante === 'fantasma') return cores.destaque;
    return cores.tinta;
  };

  const getBorderColor = () => {
    if (
      variante === 'primario' ||
      variante === 'institucional' ||
      variante === 'fantasma' ||
      variante === 'perigo'
    ) {
      return 'transparent';
    }
    return cores.linha;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || titulo}
      accessibilityState={{ disabled: isDisabled, busy: carregando }}
      style={({ pressed }) => [
        styles.base,
        compacto && styles.compact,
        {
          backgroundColor: getBackgroundColor(pressed),
          borderColor: getBorderColor(),
          borderWidth: variante === 'padrao' ? 1 : 0,
        },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            compacto && styles.compactText,
            { color: getTextColor() },
          ]}
          numberOfLines={1}
        >
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 42,
    paddingHorizontal: spacing.xl,
    paddingVertical: 10,
    borderRadius: radius.pill, // Botão pílula padrão Gupy
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  compact: {
    minHeight: 36,
    paddingHorizontal: spacing.lg,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  text: {
    fontFamily: fontNames.plexSans600,
    fontSize: 13.5,
    lineHeight: 19,
    fontWeight: '600',
  },
  compactText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

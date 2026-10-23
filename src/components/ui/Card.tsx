import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { radius, spacing } from '../../theme';

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variante?: 'padrao' | 'institucional' | 'suave';
  semPadding?: boolean;
}

export function Card({
  children,
  style,
  variante = 'padrao',
  semPadding = false,
}: CardProps) {
  const { cores } = useTheme();

  const backgroundColor =
    variante === 'institucional'
      ? cores.institucional
      : variante === 'suave'
      ? cores.superficieSecundaria
      : cores.superficie;

  const borderColor =
    variante === 'institucional' ? cores.institucionalSuave : cores.linha;

  return (
    <View
      style={[
        styles.card,
        semPadding && styles.noPadding,
        {
          backgroundColor,
          borderColor,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#101828',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  noPadding: {
    padding: 0,
    overflow: 'hidden',
  },
});

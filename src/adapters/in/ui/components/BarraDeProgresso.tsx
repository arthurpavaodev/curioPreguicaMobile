import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface BarraDeProgressoProps {
  progresso: number; // 0 a 100
  altura?: number;
  cor?: string;
  style?: ViewStyle;
}

export function BarraDeProgresso({
  progresso,
  altura = 8,
  cor,
  style,
}: BarraDeProgressoProps) {
  const { cores } = useTheme();
  const clamped = Math.max(0, Math.min(100, progresso));
  const barColor = cor || cores.destaque;

  return (
    <View
      style={[
        styles.track,
        {
          height: altura,
          backgroundColor: cores.linha,
          borderRadius: altura / 2,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            backgroundColor: barColor,
            borderRadius: altura / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { radius } from '../../theme';

export interface ProgressBarProps {
  progresso: number; // 0 a 100
  cor?: string;
  corTrilha?: string;
  altura?: number;
  style?: StyleProp<ViewStyle>;
}

export function ProgressBar({
  progresso,
  cor,
  corTrilha,
  altura = 8,
  style,
}: ProgressBarProps) {
  const { cores } = useTheme();
  const clamped = Math.max(0, Math.min(100, progresso || 0));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      style={[
        styles.track,
        {
          height: altura,
          backgroundColor: corTrilha || cores.linha,
          borderRadius: radius.pill,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clamped}%`,
            height: altura,
            backgroundColor: cor || cores.destaque,
            borderRadius: radius.pill,
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

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export interface CartaoProps {
  children: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

export function Cartao({ children, style, testID }: CartaoProps) {
  const { cores } = useTheme();

  return (
    <View
      testID={testID}
      style={[
        styles.card,
        {
          backgroundColor: cores.superficie,
          borderColor: cores.linha,
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
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
});

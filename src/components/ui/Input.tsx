import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { fontNames, radius, spacing, tipografia } from '../../theme';

export interface InputProps extends TextInputProps {
  rotulo?: string;
  apoio?: string;
  erro?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function Input({
  rotulo,
  apoio,
  erro,
  containerStyle,
  inputStyle,
  multiline,
  ...rest
}: InputProps) {
  const { cores } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {rotulo ? (
        <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 6 }]}>
          {rotulo}
        </Text>
      ) : null}

      <TextInput
        placeholderTextColor={cores.textoSecundario}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        accessibilityLabel={rest.accessibilityLabel || rotulo}
        style={[
          styles.input,
          multiline && styles.multiline,
          {
            backgroundColor: cores.superficie,
            borderColor: erro ? cores.erro : cores.linha,
            color: cores.tinta,
          },
          inputStyle,
        ]}
        {...rest}
      />

      {erro ? (
        <Text style={[tipografia.apoio, { color: cores.erro, marginTop: 4 }]}>{erro}</Text>
      ) : apoio ? (
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 4 }]}>
          {apoio}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    fontFamily: fontNames.plexSans400,
    fontSize: 14,
  },
  multiline: {
    minHeight: 110,
    paddingTop: 12,
  },
});

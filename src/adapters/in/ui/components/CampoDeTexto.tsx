import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { fontNames, tipografia } from '../theme/typography';

export interface CampoDeTextoProps extends TextInputProps {
  rotulo?: string;
  ajuda?: string;
  erro?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
}

export function CampoDeTexto({
  rotulo,
  ajuda,
  erro,
  containerStyle,
  inputStyle,
  ...props
}: CampoDeTextoProps) {
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
        style={[
          styles.input,
          {
            backgroundColor: cores.superficie,
            borderColor: erro ? cores.erro : cores.linha,
            color: cores.tinta,
            fontFamily: fontNames.plexSans400,
          },
          props.multiline && styles.multiline,
          inputStyle,
        ]}
        {...props}
      />

      {erro ? (
        <Text style={[tipografia.apoio, { color: cores.erro, marginTop: 4 }]}>{erro}</Text>
      ) : ajuda ? (
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 4 }]}>
          {ajuda}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    width: '100%',
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
});

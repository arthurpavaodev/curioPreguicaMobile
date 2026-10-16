import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tipografia } from '../theme/typography';
import { Botao } from './Botao';

export interface EstadoVazioProps {
  titulo: string;
  mensagem: string;
  acaoTexto?: string;
  onAcao?: () => void;
  style?: ViewStyle;
}

export function EstadoVazio({
  titulo,
  mensagem,
  acaoTexto,
  onAcao,
  style,
}: EstadoVazioProps) {
  const { cores } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cores.superficie,
          borderColor: cores.linha,
        },
        style,
      ]}
      accessibilityRole="text"
    >
      <Text style={[tipografia.secao, { color: cores.tinta, textAlign: 'center' }]}>
        {titulo}
      </Text>
      <Text
        style={[
          tipografia.texto,
          {
            color: cores.textoSecundario,
            textAlign: 'center',
            marginTop: 8,
            marginBottom: acaoTexto ? 16 : 0,
          },
        ]}
      >
        {mensagem}
      </Text>

      {acaoTexto && onAcao ? (
        <Botao titulo={acaoTexto} onPress={onAcao} variante="padrao" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
});

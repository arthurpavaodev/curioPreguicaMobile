import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { radius, spacing, tipografia } from '../../theme';
import { Button } from '../ui/Button';

export interface EmptyStateProps {
  titulo: string;
  mensagem: string;
  acaoTitulo?: string;
  onAcao?: () => void;
}

export function EmptyState({
  titulo,
  mensagem,
  acaoTitulo,
  onAcao,
}: EmptyStateProps) {
  const { cores } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cores.superficie,
          borderColor: cores.linha,
        },
      ]}
    >
      <Text style={[tipografia.secao, { color: cores.tinta, textAlign: 'center' }]}>
        {titulo}
      </Text>
      <Text
        style={[
          tipografia.texto,
          { color: cores.textoSecundario, textAlign: 'center', marginTop: 6 },
        ]}
      >
        {mensagem}
      </Text>

      {acaoTitulo && onAcao ? (
        <Button
          titulo={acaoTitulo}
          onPress={onAcao}
          variante="primario"
          compacto
          style={{ marginTop: spacing.md }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
});

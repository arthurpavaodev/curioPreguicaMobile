import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { radius, spacing, tipografia } from '../../theme';
import { Button } from '../ui/Button';

export interface ErrorStateProps {
  mensagem: string;
  onTentarNovamente?: () => void;
}

export function ErrorState({ mensagem, onTentarNovamente }: ErrorStateProps) {
  const { cores } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cores.erroSuave,
          borderColor: cores.erro,
        },
      ]}
    >
      <Text style={[tipografia.textoDestaque, { color: cores.erro }]}>
        Não foi possível concluir a operação
      </Text>
      <Text style={[tipografia.apoio, { color: cores.tinta, marginTop: 4 }]}>
        {mensagem}
      </Text>

      {onTentarNovamente ? (
        <Button
          titulo="Tentar novamente"
          onPress={onTentarNovamente}
          variante="padrao"
          compacto
          style={{ marginTop: spacing.sm, alignSelf: 'flex-start' }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
});

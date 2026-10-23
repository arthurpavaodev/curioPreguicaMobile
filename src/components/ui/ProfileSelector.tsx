import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { PerfilUsuario } from '../../domain';
import { fontNames, radius, spacing } from '../../theme';

interface ProfileSelectorProps {
  perfilAtual: PerfilUsuario;
  onSelecionarPerfil: (perfil: PerfilUsuario) => void;
}

const OPCOES: { id: PerfilUsuario; rotulo: string; icone: string }[] = [
  { id: 'aluno', rotulo: 'Estudante', icone: '⌂' },
  { id: 'teia', rotulo: 'Como funciona · TEIA', icone: '◎' },
  { id: 'empresa', rotulo: 'Para empresas', icone: '▤' },
];

export function ProfileSelector({
  perfilAtual,
  onSelecionarPerfil,
}: ProfileSelectorProps) {
  const { cores } = useTheme();

  return (
    <View style={styles.navBarRow}>
      {OPCOES.map((op) => {
        const ativo = perfilAtual === op.id;
        return (
          <Pressable
            key={op.id}
            onPress={() => onSelecionarPerfil(op.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Perfil ${op.rotulo}`}
            style={[
              styles.pillItem,
              {
                backgroundColor: ativo ? cores.destaque : cores.superficieSecundaria,
              },
            ]}
          >
            <Text
              style={[
                styles.pillLabel,
                {
                  color: ativo ? '#FFFFFF' : cores.tinta,
                  fontFamily: ativo ? fontNames.plexSans600 : fontNames.plexSans500,
                },
              ]}
              numberOfLines={1}
            >
              {op.icone} {op.rotulo} {ativo ? '↗' : ''}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBarRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    gap: 6,
  },
  pillItem: {
    flex: 1,
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillLabel: {
    fontSize: 11.5,
    lineHeight: 16,
  },
});

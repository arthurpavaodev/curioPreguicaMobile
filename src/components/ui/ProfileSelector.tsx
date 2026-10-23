import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { PerfilUsuario } from '../../domain';
import { fontNames, radius, spacing } from '../../theme';

interface ProfileSelectorProps {
  perfilAtual: PerfilUsuario;
  onSelecionarPerfil: (perfil: PerfilUsuario) => void;
}

const OPCOES: { id: PerfilUsuario; rotulo: string; icone: string }[] = [
  { id: 'aluno', rotulo: 'Estudante', icone: '🎓' },
  { id: 'teia', rotulo: 'Como funciona · TEIA', icone: '⚡' },
  { id: 'empresa', rotulo: 'Para empresas', icone: '🏢' },
];

export function ProfileSelector({
  perfilAtual,
  onSelecionarPerfil,
}: ProfileSelectorProps) {
  const { cores } = useTheme();

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
                  borderColor: ativo ? cores.destaque : cores.linha,
                },
              ]}
            >
              <Text style={{ fontSize: 13, marginRight: 6 }}>{op.icone}</Text>
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
                {op.rotulo}
              </Text>
              {ativo && (
                <Text style={{ color: '#FFFFFF', fontSize: 11, marginLeft: 4, fontWeight: '700' }}>
                  ↗
                </Text>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: spacing.sm,
  },
  scrollContent: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 8,
    alignItems: 'center',
  },
  pillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pillLabel: {
    fontSize: 12.5,
    lineHeight: 16,
  },
});

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { Vaga } from '../../../domain';
import { fontNames, radius, spacing, tipografia } from '../../../theme';

export interface JobSelectorProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
  rotulo?: string;
}

export function JobSelector({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
  rotulo = 'SELECIONE A VAGA',
}: JobSelectorProps) {
  const { cores } = useTheme();

  if (vagas.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 6 }]}>
        {rotulo}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {vagas.map((vaga) => {
          const selecionada = vaga.id === vagaSelecionadaId;
          return (
            <Pressable
              key={vaga.id}
              onPress={() => onSelecionarVaga(vaga.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: selecionada }}
              accessibilityLabel={`Selecionar vaga ${vaga.titulo}`}
              style={[
                styles.chip,
                {
                  backgroundColor: selecionada ? cores.destaqueSuave : cores.superficie,
                  borderColor: selecionada ? cores.destaque : cores.linha,
                },
              ]}
            >
              <View style={styles.chipTop}>
                <View
                  style={[
                    styles.avatarDot,
                    { backgroundColor: selecionada ? cores.destaque : cores.linha },
                  ]}
                >
                  <Text
                    style={{
                      color: selecionada ? '#FFFFFF' : cores.textoSecundario,
                      fontSize: 9,
                      fontWeight: '700',
                    }}
                  >
                    {vaga.empresa.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.chipSub,
                    {
                      color: selecionada ? cores.destaque : cores.textoSecundario,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {vaga.empresa}
                </Text>
              </View>
              <Text
                style={[
                  styles.chipTitle,
                  {
                    color: selecionada ? cores.destaque : cores.tinta,
                    fontFamily: selecionada ? fontNames.plexSans600 : fontNames.plexSans500,
                  },
                ]}
                numberOfLines={1}
              >
                {vaga.titulo}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingVertical: 2,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 9,
    borderRadius: radius.md,
    borderWidth: 1.5,
    minWidth: 165,
    maxWidth: 235,
  },
  chipTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 5,
  },
  avatarDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipTitle: {
    fontSize: 13,
    lineHeight: 17,
  },
  chipSub: {
    fontFamily: fontNames.plexSans500,
    fontSize: 11,
    lineHeight: 14,
    flexShrink: 1,
  },
});

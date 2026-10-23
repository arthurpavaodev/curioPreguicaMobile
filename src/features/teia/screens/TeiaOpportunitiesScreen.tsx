import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { Badge, Button, Card, NoticeBanner } from '../../../components';
import { RankeadorDeAlunos } from '../../../domain';
import { spacing, tipografia } from '../../../theme';

export interface TeiaOpportunitiesScreenProps {
  onVerRankingVaga: (vagaId: string) => void;
}

export function TeiaOpportunitiesScreen({
  onVerRankingVaga,
}: TeiaOpportunitiesScreenProps) {
  const { cores } = useTheme();
  const { vagasVisiveis, alunos, selecionarVaga } = useAppData();

  const oportunidadesMap = useMemo(() => {
    return RankeadorDeAlunos.contarCompativeisPorVaga(alunos, vagasVisiveis, 60);
  }, [alunos, vagasVisiveis]);

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={vagasVisiveis}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
              Oportunidades Mapeadas
            </Text>
            <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2, marginBottom: 12 }]}>
              Visão consolidada de quantos estudantes atingem pelo menos 60% de aderência em cada vaga.
            </Text>

            <NoticeBanner
              tipo="info"
              titulo="Dados demonstrativos locais"
              mensagem="Inclui as vagas de exemplo e as vagas publicadas no perfil Empresa neste dispositivo."
            />
          </View>
        }
        renderItem={({ item }) => {
          const info = oportunidadesMap[item.id] ?? { compativeis: 0, total: alunos.length };
          return (
            <Card style={styles.jobCard}>
              <View style={styles.topRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={[tipografia.subtitulo, { color: cores.tinta }]}>
                    {item.titulo}
                  </Text>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                    {item.empresa} · {item.requisitos.length} requisitos mapeados
                  </Text>
                </View>

                <Badge
                  rotulo={item.origem === 'exemplo' ? 'exemplo' : 'empresa'}
                  variante={item.origem === 'exemplo' ? 'padrao' : 'institucional'}
                />
              </View>

              <View style={[styles.footerRow, { borderTopColor: cores.linha }]}>
                <View>
                  <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                    ALUNOS COMPATÍVEIS (≥ 60%)
                  </Text>
                  <Text
                    style={[
                      tipografia.textoDestaque,
                      {
                        color: info.compativeis > 0 ? cores.ok : cores.textoSecundario,
                        marginTop: 2,
                      },
                    ]}
                  >
                    {info.compativeis} de {info.total} estudantes
                  </Text>
                </View>

                <Button
                  titulo="Ver ranking"
                  onPress={async () => {
                    await selecionarVaga(item.id);
                    onVerRankingVaga(item.id);
                  }}
                  variante="primario"
                  compacto
                />
              </View>
            </Card>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  header: {
    marginBottom: spacing.xs,
  },
  jobCard: {
    paddingVertical: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
});

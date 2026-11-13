import React, { useMemo } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { Badge, Button, Card } from '../../../components';
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
              Oportunidades
            </Text>
            <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
              Quantidade de estudantes com pelo menos 60% de aderência em cada vaga.
            </Text>
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
                    {item.empresa} · {item.requisitos.length} requisitos
                  </Text>
                </View>

                <Badge
                  rotulo={`${info.compativeis}/${info.total} compatíveis`}
                  variante={info.compativeis > 0 ? 'ok' : 'padrao'}
                />
              </View>

              <View style={[styles.footerRow, { borderTopColor: cores.linha }]}>
                <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                  Nota de corte referência: 60%
                </Text>

                <Button
                  titulo="Ver ranking →"
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
    paddingBottom: 36,
  },
  header: {
    marginBottom: spacing.md,
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

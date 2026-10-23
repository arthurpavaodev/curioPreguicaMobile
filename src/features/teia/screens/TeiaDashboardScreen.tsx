import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import {
  Badge,
  Card,
  EmptyState,
  NoticeBanner,
  ProgressBar,
} from '../../../components';
import { RankeadorDeAlunos } from '../../../domain';
import { radius, spacing, tipografia } from '../../../theme';
import { JobSelector } from '../../jobs/components/JobSelector';

export function TeiaDashboardScreen() {
  const { cores } = useTheme();
  const { vagasVisiveis, vagaSelecionada, alunos, selecionarVaga } = useAppData();

  const resumo = useMemo(() => {
    if (!vagaSelecionada) return null;
    return RankeadorDeAlunos.resumirPainel(alunos, vagaSelecionada);
  }, [alunos, vagaSelecionada]);

  const ranking = useMemo(() => {
    if (!vagaSelecionada) return [];
    return RankeadorDeAlunos.rankear(alunos, vagaSelecionada, 60);
  }, [alunos, vagaSelecionada]);

  if (!vagaSelecionada) {
    return (
      <View style={[styles.container, { backgroundColor: cores.fundo, padding: spacing.lg }]}>
        <EmptyState
          titulo="Nenhuma vaga selecionada"
          mensagem="Selecione uma oportunidade para visualizar os indicadores dos alunos."
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
        Painel do TEIA
      </Text>
      <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2, marginBottom: 12 }]}>
        Acompanhamento institucional da aderência dos estudantes às oportunidades.
      </Text>

      <NoticeBanner
        tipo="info"
        titulo="Modo de demonstração local"
        mensagem="Estes dados de alunos são demonstrativos e armazenados localmente no dispositivo (sem sincronização com servidor remoto)."
      />

      {/* Três Indicadores */}
      {resumo ? (
        <View style={styles.kpiRow}>
          <Card style={styles.kpiCard}>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              CADASTRADOS
            </Text>
            <Text style={[tipografia.monoValor, { color: cores.tinta, marginTop: 4 }]}>
              {resumo.cadastrados}
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              COM CURRÍCULO
            </Text>
            <Text style={[tipografia.monoValor, { color: cores.ok, marginTop: 4 }]}>
              {resumo.comCurriculo}
            </Text>
          </Card>

          <Card style={styles.kpiCard}>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              MÉDIA NA VAGA
            </Text>
            <Text style={[tipografia.monoValor, { color: cores.destaque, marginTop: 4 }]}>
              {resumo.aderenciaMedia}%
            </Text>
          </Card>
        </View>
      ) : null}

      <JobSelector
        vagas={vagasVisiveis}
        vagaSelecionadaId={vagaSelecionada.id}
        onSelecionarVaga={selecionarVaga}
      />

      {/* Ranking Compacto de Alunos */}
      <View style={styles.sectionHeader}>
        <Text style={[tipografia.secao, { color: cores.tinta }]}>
          Ranking de Aderência
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
          {ranking.length} alunos
        </Text>
      </View>

      <Card semPadding>
        {ranking.map((item, index) => {
          const { aluno, aderencia, faltam } = item;
          const isLast = index === ranking.length - 1;
          const temCurriculo = aderencia !== null;

          const badgeVariante: 'ok' | 'destaque' | 'atencao' | 'padrao' =
            !temCurriculo
              ? 'padrao'
              : aderencia >= 75
              ? 'ok'
              : aderencia >= 45
              ? 'destaque'
              : 'atencao';

          return (
            <View
              key={aluno.id}
              style={[
                styles.studentRow,
                !isLast && { borderBottomWidth: 1, borderBottomColor: cores.linha },
              ]}
            >
              <View style={styles.studentTop}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                    #{index + 1} {aluno.nome}
                  </Text>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                    {aluno.modulo}º módulo · Engenharia de Software
                  </Text>
                </View>

                <Badge
                  rotulo={temCurriculo ? `${aderencia}%` : 'sem currículo'}
                  variante={badgeVariante}
                />
              </View>

              {temCurriculo ? (
                <>
                  <ProgressBar
                    progresso={aderencia}
                    altura={6}
                    cor={
                      aderencia >= 75
                        ? cores.ok
                        : aderencia >= 45
                        ? cores.destaque
                        : cores.atencao
                    }
                    style={{ marginVertical: 6 }}
                  />
                  {faltam.length > 0 ? (
                    <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                      <Text style={{ fontWeight: '600', color: cores.tinta }}>Lacunas: </Text>
                      {faltam.join(', ')}
                    </Text>
                  ) : (
                    <Text style={[tipografia.apoio, { color: cores.ok }]}>
                      ✓ Atende a todos os requisitos identificados da vaga.
                    </Text>
                  )}
                </>
              ) : (
                <Text style={[tipografia.apoio, { color: cores.atencao, marginTop: 4 }]}>
                  Pendente: solicitar cadastro do currículo.
                </Text>
              )}
            </View>
          );
        })}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  kpiRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  kpiCard: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderRadius: radius.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  studentRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  studentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
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
  ProgressBar,
} from '../../../components';
import { EtapaDoPlano } from '../../../domain';
import { fontNames, spacing, tipografia } from '../../../theme';
import { JobSelector } from '../../jobs/components/JobSelector';

type AbaPlano = 'todas' | 'curriculo' | 'competencias';

export function FlightPlanScreen() {
  const { cores } = useTheme();
  const {
    vagasVisiveis,
    vagaSelecionada,
    planoAtual,
    carregando,
    selecionarVaga,
    alternarEtapaPlano,
  } = useAppData();

  const [abaAtiva, setAbaAtiva] = useState<AbaPlano>('todas');

  if (carregando) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  if (!planoAtual || !vagaSelecionada) {
    return (
      <View style={[styles.container, { backgroundColor: cores.fundo, padding: spacing.lg }]}>
        <EmptyState
          titulo="Nenhum plano disponível"
          mensagem="Selecione uma vaga para gerar seu plano de voo personalizado."
        />
      </View>
    );
  }

  const { etapas, concluidasCount, totalEtapas, progresso } = planoAtual;

  const etapasCurriculo = etapas.filter((e) => e.grupo === 'curriculo');
  const etapasCompetencias = etapas.filter((e) => e.grupo === 'competencias');

  const etapasFiltradas =
    abaAtiva === 'curriculo'
      ? etapasCurriculo
      : abaAtiva === 'competencias'
      ? etapasCompetencias
      : etapas;

  const renderChecklistItem = (etapa: EtapaDoPlano, isLast: boolean) => {
    const isPrioritaria = !etapa.concluida && !etapa.titulo.includes('(diferencial)');

    return (
      <Pressable
        key={etapa.id}
        onPress={() => alternarEtapaPlano(etapa.id, !etapa.concluida)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: etapa.concluida }}
        accessibilityLabel={`${etapa.titulo}. ${etapa.concluida ? 'Concluída' : 'Pendente'}`}
        style={({ pressed }) => [
          styles.taskItem,
          !isLast && { borderBottomWidth: 1, borderBottomColor: cores.linha },
          etapa.concluida && { backgroundColor: cores.superficieSecundaria },
          pressed && { opacity: 0.85 },
        ]}
      >
        <View
          style={[
            styles.checkbox,
            {
              borderColor: etapa.concluida ? cores.destaque : cores.linha,
              backgroundColor: etapa.concluida ? cores.destaque : cores.superficie,
            },
          ]}
        >
          {etapa.concluida ? <Text style={styles.checkIcon}>✓</Text> : null}
        </View>

        <View style={styles.taskBody}>
          <View style={styles.taskTitleRow}>
            <Text
              style={[
                tipografia.textoDestaque,
                {
                  flex: 1,
                  color: etapa.concluida ? cores.textoSecundario : cores.tinta,
                  textDecorationLine: etapa.concluida ? 'line-through' : 'none',
                },
              ]}
            >
              {etapa.titulo}
            </Text>
            {isPrioritaria ? <Badge rotulo="Prioritária" variante="destaque" /> : null}
          </View>

          <Text
            style={[
              tipografia.apoio,
              {
                color: cores.textoSecundario,
                marginTop: 2,
                textDecorationLine: etapa.concluida ? 'line-through' : 'none',
              },
            ]}
          >
            {etapa.detalhe}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerBlock}>
        <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
          Plano de Voo
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
          Marque as etapas concluídas para evoluir seu currículo e competências.
        </Text>
      </View>

      <JobSelector
        vagas={vagasVisiveis}
        vagaSelecionadaId={vagaSelecionada.id}
        onSelecionarVaga={selecionarVaga}
      />

      {/* Card Enxuto de Progresso */}
      <Card>
        <View style={styles.progressHeader}>
          <View>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              PROGRESSO NA VAGA
            </Text>
            <Text style={[tipografia.monoValor, { color: cores.destaque, marginTop: 2 }]}>
              {progresso}% concluído
            </Text>
          </View>
          <Badge
            rotulo={`${concluidasCount}/${totalEtapas} etapas`}
            variante={progresso === 100 ? 'ok' : 'destaque'}
          />
        </View>

        <ProgressBar
          progresso={progresso}
          cor={progresso === 100 ? cores.ok : cores.destaque}
          altura={8}
          style={{ marginTop: spacing.sm }}
        />
      </Card>

      {/* Abas */}
      <View style={[styles.underlineTabs, { borderBottomColor: cores.linha }]}>
        {(
          [
            { id: 'todas', rotulo: `Todas (${totalEtapas})` },
            { id: 'curriculo', rotulo: `Currículo (${etapasCurriculo.length})` },
            { id: 'competencias', rotulo: `Competências (${etapasCompetencias.length})` },
          ] as { id: AbaPlano; rotulo: string }[]
        ).map((tab) => {
          const ativa = abaAtiva === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => setAbaAtiva(tab.id)}
              style={[
                styles.underlineTabItem,
                ativa && {
                  borderBottomColor: cores.destaque,
                  borderBottomWidth: 3,
                },
              ]}
            >
              <Text
                style={[
                  styles.underlineTabText,
                  {
                    color: ativa ? cores.destaque : cores.textoSecundario,
                    fontFamily: ativa ? fontNames.plexSans600 : fontNames.plexSans400,
                  },
                ]}
              >
                {tab.rotulo}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Card semPadding>
        {etapasFiltradas.map((etapa, idx) =>
          renderChecklistItem(etapa, idx === etapasFiltradas.length - 1),
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: 36,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBlock: {
    marginBottom: spacing.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  underlineTabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    marginBottom: spacing.md,
    gap: spacing.lg,
  },
  underlineTabItem: {
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  underlineTabText: {
    fontSize: 13,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    marginTop: 2,
  },
  checkIcon: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  taskBody: {
    flex: 1,
  },
  taskTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.xs,
  },
});

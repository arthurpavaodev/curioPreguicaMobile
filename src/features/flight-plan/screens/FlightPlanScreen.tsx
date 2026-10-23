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
  NoticeBanner,
  ProgressBar,
} from '../../../components';
import { EtapaDoPlano } from '../../../domain';
import { fontNames, radius, spacing, tipografia } from '../../../theme';
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
  const pendentesCount = totalEtapas - concluidasCount;

  const etapasCurriculo = etapas.filter((e) => e.grupo === 'curriculo');
  const etapasCompetencias = etapas.filter((e) => e.grupo === 'competencias');

  const prioritariasCount = etapas.filter(
    (e) => !e.concluida && !e.titulo.includes('(diferencial)'),
  ).length;

  const mostrarCurriculo = abaAtiva === 'todas' || abaAtiva === 'curriculo';
  const mostrarCompetencias = abaAtiva === 'todas' || abaAtiva === 'competencias';

  const renderChecklistItem = (etapa: EtapaDoPlano, isLast: boolean) => {
    const isPrioritaria = !etapa.concluida && !eIsDiferencial(etapa);

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
            {isPrioritaria ? <Badge rotulo="prioritária" variante="destaque" /> : null}
          </View>

          <Text
            style={[
              tipografia.apoio,
              {
                color: cores.textoSecundario,
                marginTop: 3,
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
      {/* Cabeçalho Centralizado Estilo CREA-MA */}
      <View style={{ alignItems: 'center', marginBottom: spacing.md }}>
        <Text
          style={{
            fontFamily: fontNames.plexSans600,
            fontSize: 11,
            letterSpacing: 1,
            fontWeight: '700',
            textTransform: 'uppercase',
            color: cores.destaque,
            marginBottom: 4,
          }}
        >
          ROADMAP DE EVOLUÇÃO
        </Text>
        <Text
          style={[
            tipografia.tituloTela,
            { color: cores.tinta, textAlign: 'center' },
          ]}
        >
          Clareza em cada etapa{'\n'}do seu{' '}
          <Text style={{ color: cores.laranjaDestaque }}>Plano de Voo!</Text>{' '}
          <Text style={{ color: '#00E640' }}>✳</Text>
        </Text>
      </View>

      <JobSelector
        vagas={vagasVisiveis}
        vagaSelecionadaId={vagaSelecionada.id}
        onSelecionarVaga={selecionarVaga}
      />

      {/* Card Resumo de Progresso Estilo Gupy */}
      <Card>
        <View style={styles.progressHeader}>
          <View>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
              SEU PROGRESSO NA JORNADA
            </Text>
            <Text style={[tipografia.monoDestaque, { color: cores.destaque, marginTop: 2 }]}>
              {progresso}%
            </Text>
          </View>
          <Badge
            rotulo={`${concluidasCount}/${totalEtapas} etapas`}
            variante={progresso === 100 ? 'ok' : 'destaque'}
          />
        </View>

        <View style={styles.progressLineRow}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <ProgressBar
              progresso={progresso}
              cor={progresso === 100 ? cores.ok : cores.destaque}
              altura={8}
            />
          </View>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario, fontWeight: '600' }]}>
            {concluidasCount}/{totalEtapas}
          </Text>
        </View>

        <View style={styles.overviewBoxes}>
          <View
            style={[
              styles.overviewBox,
              { backgroundColor: cores.superficieSecundaria, borderColor: cores.linha },
            ]}
          >
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>A FAZER</Text>
            <Text style={[tipografia.monoValor, { color: cores.tinta, marginTop: 2 }]}>
              {pendentesCount}
            </Text>
          </View>

          <View
            style={[
              styles.overviewBox,
              { backgroundColor: cores.destaqueSuave, borderColor: 'transparent' },
            ]}
          >
            <Text style={[tipografia.rotulo, { color: cores.destaque }]}>PRIORITÁRIAS</Text>
            <Text style={[tipografia.monoValor, { color: cores.destaque, marginTop: 2 }]}>
              {prioritariasCount}
            </Text>
          </View>

          <View
            style={[
              styles.overviewBox,
              { backgroundColor: cores.okSuave, borderColor: 'transparent' },
            ]}
          >
            <Text style={[tipografia.rotulo, { color: cores.ok }]}>CONCLUÍDAS</Text>
            <Text style={[tipografia.monoValor, { color: cores.ok, marginTop: 2 }]}>
              {concluidasCount}
            </Text>
          </View>
        </View>
      </Card>

      {/* Abas Estilo Gupy ("Curso | Conteúdo") */}
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

      <NoticeBanner
        tipo="info"
        mensagem="Toque em qualquer etapa abaixo para marcar ou desmarcar sua conclusão."
      />

      {/* Grupo 1: Ajustar o Currículo */}
      {mostrarCurriculo && etapasCurriculo.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[tipografia.secao, { color: cores.tinta }]}>
              <Text style={{ color: cores.destaque }}>↗ </Text>
              Ajustes no Currículo
            </Text>
            <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
              {etapasCurriculo.filter((e) => e.concluida).length}/{etapasCurriculo.length}
            </Text>
          </View>

          <Card semPadding>
            {etapasCurriculo.map((etapa, idx) =>
              renderChecklistItem(etapa, idx === etapasCurriculo.length - 1),
            )}
          </Card>
        </>
      ) : null}

      {/* Grupo 2: Desenvolver Competências */}
      {mostrarCompetencias && etapasCompetencias.length > 0 ? (
        <>
          <View style={styles.sectionHeader}>
            <Text style={[tipografia.secao, { color: cores.tinta }]}>
              <Text style={{ color: cores.destaque }}>↗ </Text>
              Trilha de Competências
            </Text>
            <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
              {etapasCompetencias.filter((e) => e.concluida).length}/{etapasCompetencias.length}
            </Text>
          </View>

          <Card semPadding>
            {etapasCompetencias.map((etapa, idx) =>
              renderChecklistItem(etapa, idx === etapasCompetencias.length - 1),
            )}
          </Card>
        </>
      ) : null}
    </ScrollView>
  );
}

function eIsDiferencial(etapa: EtapaDoPlano): boolean {
  return etapa.titulo.includes('(diferencial)');
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  progressLineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  overviewBoxes: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  overviewBox: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
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

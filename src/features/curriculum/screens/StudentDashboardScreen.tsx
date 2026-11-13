import React, { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import { Badge, Button, Card, ProgressBar } from '../../../components';
import { fontNames, radius, spacing, tipografia } from '../../../theme';

export interface StudentDashboardScreenProps {
  onIrParaCurriculo: () => void;
  onIrParaVagas: () => void;
  onIrParaDiagnostico: (vagaId?: string) => void;
  onIrParaPlano: (vagaId?: string) => void;
}

export function StudentDashboardScreen({
  onIrParaCurriculo,
  onIrParaVagas,
  onIrParaDiagnostico,
  onIrParaPlano,
}: StudentDashboardScreenProps) {
  const { cores } = useTheme();
  const {
    curriculo,
    analiseCurriculo,
    vagasComDiagnostico,
    vagaSelecionada,
    diagnosticoAtual,
    planoAtual,
  } = useAppData();

  const proximaTarefa = useMemo(() => {
    if (!planoAtual) return null;
    return planoAtual.etapas.find((e) => !e.concluida) ?? null;
  }, [planoAtual]);

  const aderencia = diagnosticoAtual?.aderencia ?? 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.content}
    >
      {/* Cabeçalho direto e limpo */}
      <View style={styles.headerBlock}>
        <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
          Resumo do Estudante
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
          Acompanhe sua compatibilidade e os próximos passos para a vaga escolhida.
        </Text>
      </View>

      {/* Card Principal: Vaga em Foco + Compatibilidade */}
      <Card>
        <View style={styles.focusTopRow}>
          <View style={{ flex: 1, marginRight: spacing.sm }}>
            <Text style={[tipografia.rotulo, { color: cores.destaque }]}>
              VAGA SELECIONADA
            </Text>
            <Text style={[styles.focusJobTitle, { color: cores.tinta }]} numberOfLines={1}>
              {vagaSelecionada ? vagaSelecionada.titulo : 'Selecione uma vaga'}
            </Text>
            {vagaSelecionada ? (
              <Text style={[tipografia.apoio, { color: cores.textoSecundario }]} numberOfLines={1}>
                {vagaSelecionada.empresa}
              </Text>
            ) : null}
          </View>

          <View style={styles.scoreBadgeWrap}>
            <Text style={[styles.scoreNumber, { color: cores.destaque }]}>
              {diagnosticoAtual?.aderencia !== null && diagnosticoAtual?.aderencia !== undefined
                ? `${aderencia}%`
                : '—'}
            </Text>
            <Text style={[tipografia.apoio, { color: cores.textoSecundario, fontSize: 11 }]}>
              compatível
            </Text>
          </View>
        </View>

        <ProgressBar
          progresso={aderencia}
          cor={aderencia >= 75 ? cores.ok : cores.destaque}
          altura={8}
          style={{ marginVertical: spacing.sm }}
        />

        <View style={[styles.focusActionsRow, { borderTopColor: cores.linha }]}>
          <Pressable onPress={onIrParaVagas} hitSlop={8}>
            <Text style={[tipografia.textoDestaque, { color: cores.textoSecundario }]}>
              Trocar vaga
            </Text>
          </Pressable>

          <Button
            titulo="Ver diagnóstico →"
            onPress={() => onIrParaDiagnostico(vagaSelecionada?.id)}
            variante="primario"
            compacto
          />
        </View>
      </Card>

      {/* Próximo Passo do Plano de Voo */}
      <Pressable
        onPress={() => onIrParaPlano(vagaSelecionada?.id)}
        style={[
          styles.nextStepCard,
          { backgroundColor: cores.superficie, borderColor: cores.linha },
        ]}
      >
        <View style={styles.nextStepHeader}>
          <Text style={[tipografia.rotulo, { color: cores.laranjaDestaque }]}>
            PRÓXIMA ETAPA DO PLANO
          </Text>
          <Badge
            rotulo={
              planoAtual ? `${planoAtual.concluidasCount}/${planoAtual.totalEtapas}` : '0/0'
            }
            variante="destaque"
          />
        </View>

        <Text style={[tipografia.textoDestaque, { color: cores.tinta, marginTop: 4 }]}>
          {proximaTarefa
            ? proximaTarefa.titulo
            : 'Todas as etapas para esta vaga foram concluídas!'}
        </Text>

        {proximaTarefa ? (
          <Text
            style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}
            numberOfLines={2}
          >
            {proximaTarefa.detalhe}
          </Text>
        ) : null}
      </Pressable>

      {/* Atalhos Essenciais da Jornada (4 passos enxutos) */}
      <Text style={[tipografia.rotulo, styles.sectionTitle, { color: cores.textoSecundario }]}>
        SUA JORNADA
      </Text>

      <View style={styles.stepsGrid}>
        <Pressable
          onPress={onIrParaCurriculo}
          style={[
            styles.stepCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <Text style={styles.stepIcon}>📄</Text>
          <Text style={[styles.stepTitle, { color: cores.tinta }]}>1. Currículo</Text>
          <Text style={[styles.stepMeta, { color: cores.textoSecundario }]} numberOfLines={1}>
            {curriculo.nomeArquivo ? 'PDF importado' : 'Modo exemplo'} ·{' '}
            {analiseCurriculo.competenciasReconhecidas.length} skills
          </Text>
        </Pressable>

        <Pressable
          onPress={onIrParaVagas}
          style={[
            styles.stepCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <Text style={styles.stepIcon}>💼</Text>
          <Text style={[styles.stepTitle, { color: cores.tinta }]}>2. Vagas</Text>
          <Text style={[styles.stepMeta, { color: cores.textoSecundario }]} numberOfLines={1}>
            {vagasComDiagnostico.length} disponíveis
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onIrParaDiagnostico(vagaSelecionada?.id)}
          style={[
            styles.stepCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <Text style={styles.stepIcon}>🎯</Text>
          <Text style={[styles.stepTitle, { color: cores.tinta }]}>3. Diagnóstico</Text>
          <Text style={[styles.stepMeta, { color: cores.textoSecundario }]} numberOfLines={1}>
            {diagnosticoAtual
              ? `${diagnosticoAtual.requisitosAtendidosCount}/${diagnosticoAtual.totalRequisitos} requisitos`
              : 'Ver análise'}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onIrParaPlano(vagaSelecionada?.id)}
          style={[
            styles.stepCard,
            { backgroundColor: cores.superficie, borderColor: cores.linha },
          ]}
        >
          <Text style={styles.stepIcon}>✈</Text>
          <Text style={[styles.stepTitle, { color: cores.tinta }]}>4. Plano de Voo</Text>
          <Text style={[styles.stepMeta, { color: cores.textoSecundario }]} numberOfLines={1}>
            {planoAtual ? `${planoAtual.progresso}% concluído` : 'Ver checklist'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 36,
  },
  headerBlock: {
    marginBottom: spacing.md,
  },
  focusTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  focusJobTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '700',
    marginTop: 2,
  },
  scoreBadgeWrap: {
    alignItems: 'flex-end',
  },
  scoreNumber: {
    fontFamily: fontNames.bricolage700,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
  },
  focusActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.xs,
  },
  nextStepCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  nextStepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: spacing.sm,
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  stepCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.md,
  },
  stepIcon: {
    fontSize: 18,
    marginBottom: 6,
  },
  stepTitle: {
    fontFamily: fontNames.bricolage600,
    fontSize: 15,
    fontWeight: '600',
  },
  stepMeta: {
    fontFamily: fontNames.plexSans400,
    fontSize: 12,
    marginTop: 2,
  },
});

import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
  Button,
  Card,
  EmptyState,
  NoticeBanner,
} from '../../../components';
import { fontNames, spacing, tipografia } from '../../../theme';
import { JobSelector } from '../../jobs/components/JobSelector';
import { AdherenceMeter } from '../components/AdherenceMeter';

export interface DiagnosisScreenProps {
  onNavegarParaPlano: () => void;
  onNavegarParaCurriculo: () => void;
}

type AbaDiagnostico = 'pendentes' | 'atendidos' | 'estrutura';

export function DiagnosisScreen({
  onNavegarParaPlano,
  onNavegarParaCurriculo,
}: DiagnosisScreenProps) {
  const { cores } = useTheme();
  const {
    vagasVisiveis,
    vagaSelecionada,
    diagnosticoAtual,
    textoCurriculo,
    carregando,
    selecionarVaga,
    candidatarVaga,
    jaCandidatouNaVaga,
  } = useAppData();

  const [abaAtiva, setAbaAtiva] = useState<AbaDiagnostico>('pendentes');

  if (carregando) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  if (!diagnosticoAtual || !vagaSelecionada) {
    return (
      <View style={[styles.container, { backgroundColor: cores.fundo, padding: spacing.lg }]}>
        <EmptyState
          titulo="Nenhum diagnóstico disponível"
          mensagem="Selecione uma vaga para visualizar a análise do seu currículo."
        />
      </View>
    );
  }

  const {
    aderencia,
    nivel,
    totalRequisitos,
    requisitosAtendidosCount,
    requisitosAtendidos,
    requisitosFaltantes,
    pontosFracos,
    ortografia,
  } = diagnosticoAtual;

  const curriculoVazio = textoCurriculo.trim().length === 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.headerBlock}>
        <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
          Diagnóstico
        </Text>
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
          Veja o que você já atende e o que falta para a vaga selecionada.
        </Text>
      </View>

      <JobSelector
        vagas={vagasVisiveis}
        vagaSelecionadaId={vagaSelecionada.id}
        onSelecionarVaga={selecionarVaga}
      />

      {curriculoVazio ? (
        <NoticeBanner
          tipo="atencao"
          titulo="Currículo vazio"
          mensagem="Importe ou preencha seu currículo na aba 'Currículo' para calcular sua aderência."
        />
      ) : null}

      {/* Card Principal: Compatibilidade + Ações Diretas */}
      <Card>
        <AdherenceMeter
          aderencia={aderencia}
          nivelRotulo={nivel.rotulo}
          requisitosAtendidos={requisitosAtendidosCount}
          totalRequisitos={totalRequisitos}
        />

        <View style={[styles.ctaRow, { borderTopColor: cores.linha }]}>
          {curriculoVazio ? (
            <Button
              titulo="Preencher Currículo"
              onPress={onNavegarParaCurriculo}
              variante="padrao"
              compacto
            />
          ) : jaCandidatouNaVaga(vagaSelecionada.id) ? (
            <Badge rotulo="Inscrito na vaga ✓" variante="ok" />
          ) : (
            <Button
              titulo="Candidatar-se"
              onPress={async () => {
                const ok = await candidatarVaga(vagaSelecionada.id);
                if (ok) {
                  Alert.alert(
                    'Candidatura Confirmada!',
                    `Você se candidatou para "${vagaSelecionada.titulo}".`,
                  );
                }
              }}
              variante="padrao"
              compacto
            />
          )}

          <Button
            titulo="Plano de Voo →"
            onPress={onNavegarParaPlano}
            variante="primario"
            compacto
          />
        </View>
      </Card>

      {/* Abas de Detalhamento */}
      <View style={[styles.underlineTabs, { borderBottomColor: cores.linha }]}>
        {(
          [
            { id: 'pendentes', rotulo: `Faltam (${requisitosFaltantes.length})` },
            { id: 'atendidos', rotulo: `Atendidos (${requisitosAtendidos.length})` },
            {
              id: 'estrutura',
              rotulo: `Revisão CV (${pontosFracos.length + ortografia.length})`,
            },
          ] as { id: AbaDiagnostico; rotulo: string }[]
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

      {abaAtiva === 'pendentes' ? (
        <Card semPadding>
          {requisitosFaltantes.length === 0 ? (
            <View style={styles.emptySectionRow}>
              <Text style={[tipografia.textoMedio, { color: cores.ok }]}>
                ✓ Todos os requisitos desta vaga constam no seu currículo!
              </Text>
            </View>
          ) : (
            requisitosFaltantes.map((item, idx) => {
              const isLast = idx === requisitosFaltantes.length - 1;
              return (
                <View
                  key={`faltante_${item.requisito.id}_${idx}`}
                  style={[
                    styles.compactRow,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: cores.linha },
                  ]}
                >
                  <View style={styles.compactRowHeader}>
                    <Text style={[tipografia.textoDestaque, { color: cores.tinta, flex: 1 }]}>
                      {item.requisito.rotulo}
                    </Text>
                    <Badge
                      rotulo={item.obrigatorio ? 'Obrigatório' : 'Diferencial'}
                      variante={item.obrigatorio ? 'erro' : 'atencao'}
                    />
                  </View>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 4 }]}>
                    {item.acaoSugerida}
                  </Text>
                </View>
              );
            })
          )}
        </Card>
      ) : null}

      {abaAtiva === 'atendidos' ? (
        <Card semPadding>
          {requisitosAtendidos.length === 0 ? (
            <View style={styles.emptySectionRow}>
              <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                Nenhum requisito desta vaga foi identificado no currículo atual.
              </Text>
            </View>
          ) : (
            requisitosAtendidos.map((item, idx) => {
              const isLast = idx === requisitosAtendidos.length - 1;
              return (
                <View
                  key={`atendido_${item.requisito.id}_${idx}`}
                  style={[
                    styles.compactRow,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: cores.linha },
                  ]}
                >
                  <View style={styles.compactRowHeader}>
                    <Text style={[tipografia.textoDestaque, { color: cores.tinta, flex: 1 }]}>
                      ✓ {item.requisito.rotulo}
                    </Text>
                    <Badge rotulo="Atendido" variante="ok" />
                  </View>
                </View>
              );
            })
          )}
        </Card>
      ) : null}

      {abaAtiva === 'estrutura' ? (
        <Card semPadding>
          {ortografia.length === 0 && pontosFracos.length === 0 ? (
            <View style={styles.emptySectionRow}>
              <Text style={[tipografia.apoio, { color: cores.ok }]}>
                ✓ Estrutura completa e sem alertas ortográficos.
              </Text>
            </View>
          ) : (
            <View style={styles.compactRow}>
              {ortografia.map((item, idx) => (
                <Text
                  key={`orto_${idx}`}
                  style={[tipografia.apoio, { color: cores.tinta, marginVertical: 3 }]}
                >
                  <Text style={{ color: cores.erro, fontWeight: '700' }}>! </Text>
                  {item.rotulo}
                </Text>
              ))}
              {pontosFracos.map((pf, idx) => (
                <Text
                  key={`pfr_${idx}`}
                  style={[tipografia.apoio, { color: cores.tinta, marginVertical: 3 }]}
                >
                  <Text style={{ color: cores.atencao, fontWeight: '700' }}>• </Text>
                  {pf}
                </Text>
              ))}
            </View>
          )}
        </Card>
      ) : null}
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
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.md,
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
  emptySectionRow: {
    padding: spacing.lg,
  },
  compactRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  compactRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
});

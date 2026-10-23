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
    planoAtual,
    textoCurriculo,
    carregando,
    selecionarVaga,
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
          mensagem="Selecione uma vaga para visualizar a análise detalhada do seu currículo."
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
    pontosFortes,
    pontosFracos,
    ortografia,
  } = diagnosticoAtual;

  const curriculoVazio = textoCurriculo.trim().length === 0;
  const pendentesNoPlano = planoAtual
    ? planoAtual.totalEtapas - planoAtual.concluidasCount
    : 0;

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
          TRIAGEM E COMPATIBILIDADE
        </Text>
        <Text
          style={[
            tipografia.tituloTela,
            { color: cores.tinta, textAlign: 'center' },
          ]}
        >
          Diagnóstico{' '}
          <Text style={{ color: cores.laranjaDestaque }}>detalhado</Text>
          {'\n'}do seu perfil!
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
          titulo="Seu currículo está vazio"
          mensagem="Cole seu currículo na aba 'Currículo' para identificar quais requisitos desta vaga você já atende."
        />
      ) : null}

      {/* Card Principal: Nota de Aderência em Destaque + Botão Pílula Gupy */}
      <Card>
        <AdherenceMeter
          aderencia={aderencia}
          nivelRotulo={nivel.rotulo}
          requisitosAtendidos={requisitosAtendidosCount}
          totalRequisitos={totalRequisitos}
        />

        <View style={[styles.ctaRow, { borderTopColor: cores.linha }]}>
          {curriculoVazio ? (
            <Pressable onPress={onNavegarParaCurriculo}>
              <Text style={[tipografia.textoDestaque, { color: cores.destaque }]}>
                Preencher Currículo
              </Text>
            </Pressable>
          ) : (
            <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
              {pendentesNoPlano} etapas recomendadas
            </Text>
          )}

          <Button
            titulo={
              pendentesNoPlano > 0
                ? 'Gerar Plano de Melhoria →'
                : 'Abrir Plano de Voo →'
            }
            onPress={onNavegarParaPlano}
            variante="primario"
            compacto
          />
        </View>
      </Card>

      {aderencia === null ? (
        <NoticeBanner
          tipo="atencao"
          titulo="Sem requisitos reconhecidos nesta vaga"
          mensagem="A descrição informada não contém competências do catálogo nem itens de requisito claros para cálculo da porcentagem."
        />
      ) : null}

      {/* Abas com Sublinhado Azul Elétrico Estilo Gupy */}
      <View style={[styles.underlineTabs, { borderBottomColor: cores.linha }]}>
        {(
          [
            { id: 'pendentes', rotulo: `Pendentes (${requisitosFaltantes.length})` },
            { id: 'atendidos', rotulo: `Atendidos (${requisitosAtendidos.length})` },
            {
              id: 'estrutura',
              rotulo: `Currículo & Escrita (${pontosFracos.length + ortografia.length})`,
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

      {/* Conteúdo da Aba Selecionada (Lista Compacta) */}
      {abaAtiva === 'pendentes' ? (
        <Card semPadding>
          {requisitosFaltantes.length === 0 ? (
            <View style={styles.emptySectionRow}>
              <Text style={[tipografia.textoMedio, { color: cores.ok }]}>
                ✓ Parabéns! Todos os requisitos identificados nesta vaga constam no seu currículo.
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
                      rotulo={item.obrigatorio ? 'obrigatório · peso 2' : 'diferencial · peso 1'}
                      variante={item.obrigatorio ? 'erro' : 'atencao'}
                    />
                  </View>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 4 }]}>
                    <Text style={{ fontWeight: '600', color: cores.tinta }}>Recomendação: </Text>
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
                Nenhum requisito desta vaga foi encontrado no texto atual do currículo.
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
                    <Badge rotulo="atendido" variante="ok" />
                  </View>
                  {item.evidencia ? (
                    <Text
                      style={[
                        tipografia.apoio,
                        { color: cores.textoSecundario, fontStyle: 'italic', marginTop: 4 },
                      ]}
                    >
                      Evidência extraída: "{item.evidencia}"
                    </Text>
                  ) : null}
                </View>
              );
            })
          )}
        </Card>
      ) : null}

      {abaAtiva === 'estrutura' ? (
        <Card semPadding>
          <View
            style={[
              styles.compactRow,
              { borderBottomWidth: 1, borderBottomColor: cores.linha },
            ]}
          >
            <View style={styles.compactRowHeader}>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                ORTOGRAFIA E ACENTUAÇÃO
              </Text>
              <Badge
                rotulo={
                  ortografia.length === 0
                    ? 'Sem alertas'
                    : `${ortografia.length} revisão(ões)`
                }
                variante={ortografia.length === 0 ? 'ok' : 'erro'}
              />
            </View>

            {ortografia.length === 0 ? (
              <Text style={[tipografia.apoio, { color: cores.ok, marginTop: 4 }]}>
                Nenhuma palavra sem acento ou repetida em sequência foi detectada.
              </Text>
            ) : (
              <View style={{ marginTop: 6, gap: 4 }}>
                {ortografia.map((item, idx) => (
                  <Text key={`orto_${idx}`} style={[tipografia.apoio, { color: cores.tinta }]}>
                    <Text style={{ color: cores.erro, fontWeight: '700' }}>! </Text>
                    {item.rotulo}
                  </Text>
                ))}
              </View>
            )}
          </View>

          {pontosFracos.length > 0 ? (
            <View
              style={[
                styles.compactRow,
                pontosFortes.length > 0 && { borderBottomWidth: 1, borderBottomColor: cores.linha },
              ]}
            >
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 6 }]}>
                PONTOS A MELHORAR ({pontosFracos.length})
              </Text>
              {pontosFracos.map((pf, idx) => (
                <Text
                  key={`pfr_${idx}`}
                  style={[tipografia.apoio, { color: cores.tinta, marginVertical: 2 }]}
                >
                  <Text style={{ color: cores.atencao, fontWeight: '700' }}>• </Text>
                  {pf}
                </Text>
              ))}
            </View>
          ) : null}

          {pontosFortes.length > 0 ? (
            <View style={styles.compactRow}>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 6 }]}>
                PONTOS FORTES IDENTIFICADOS ({pontosFortes.length})
              </Text>
              {pontosFortes.map((pf, idx) => (
                <Text
                  key={`pf_${idx}`}
                  style={[tipografia.apoio, { color: cores.tinta, marginVertical: 2 }]}
                >
                  <Text style={{ color: cores.ok, fontWeight: '700' }}>✓ </Text>
                  {pf}
                </Text>
              ))}
            </View>
          ) : null}
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
    paddingBottom: 40,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.md,
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

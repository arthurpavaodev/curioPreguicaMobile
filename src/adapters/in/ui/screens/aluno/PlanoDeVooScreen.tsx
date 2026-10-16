import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Vaga } from '../../../../domain';
import {
  BarraDeProgresso,
  Cartao,
  EstadoVazio,
  SeletorDeVaga,
  Selo,
} from '../../components';
import { usePlano } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

interface PlanoDeVooScreenProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
}

export function PlanoDeVooScreen({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
}: PlanoDeVooScreenProps) {
  const { cores } = useTheme();
  const { plano, carregando, erro, alternarEtapa } = usePlano(vagaSelecionadaId);

  if (carregando) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  if (!plano) {
    return (
      <View style={[styles.container, { backgroundColor: cores.fundo }]}>
        <EstadoVazio
          titulo="Nenhum plano disponível"
          mensagem="Selecione uma vaga para gerar seu plano de voo personalizado."
        />
      </View>
    );
  }

  const { etapas, concluidasCount, totalEtapas, progresso } = plano;

  const etapasCurriculo = etapas.filter((e) => e.grupo === 'curriculo');
  const etapasCompetencias = etapas.filter((e) => e.grupo === 'competencias');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: cores.fundo }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
        Plano de Voo
      </Text>
      <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
        Um roteiro prático para adequar seu currículo e desenvolver as competências que faltam.
      </Text>

      {/* Seletor de vaga */}
      <SeletorDeVaga
        vagas={vagas}
        vagaSelecionadaId={vagaSelecionadaId}
        onSelecionarVaga={onSelecionarVaga}
      />

      {/* Progresso Geral */}
      <Cartao>
        <View style={styles.progressoHeaderRow}>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            PROGRESSO GERAL
          </Text>
          <Text style={[tipografia.monoValor, { color: cores.destaque }]}>
            {progresso}%
          </Text>
        </View>

        <BarraDeProgresso progresso={progresso} altura={10} style={{ marginVertical: 10 }} />

        <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
          {concluidasCount} de {totalEtapas} etapas concluídas
        </Text>
      </Cartao>

      {/* Grupo: Ajustar o currículo */}
      {etapasCurriculo.length > 0 ? (
        <>
          <View style={styles.secaoHeader}>
            <Text style={[tipografia.secao, { color: cores.tinta }]}>
              Ajustar o Currículo ({etapasCurriculo.filter((e) => e.concluida).length}/{etapasCurriculo.length})
            </Text>
          </View>

          {etapasCurriculo.map((etapa) => (
            <Pressable
              key={etapa.id}
              onPress={() => alternarEtapa(etapa.id, !etapa.concluida)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: etapa.concluida }}
              accessibilityLabel={`${etapa.titulo}. ${etapa.concluida ? 'Concluída' : 'Pendente'}`}
            >
              <Cartao
                style={[
                  etapa.concluida && {
                    opacity: 0.85,
                    backgroundColor: cores.isDark ? '#0c1a24' : '#F6F9FA',
                  },
                ]}
              >
                <View style={styles.etapaRow}>
                  {/* Caixa de seleção acessível (min 44pt) */}
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: etapa.concluida ? cores.ok : cores.linha,
                        backgroundColor: etapa.concluida ? cores.ok : 'transparent',
                      },
                    ]}
                  >
                    {etapa.concluida ? (
                      <Text style={[styles.checkMark, { color: '#FFFFFF' }]}>✓</Text>
                    ) : null}
                  </View>

                  <View style={styles.etapaTextos}>
                    <Text
                      style={[
                        tipografia.textoDestaque,
                        {
                          color: etapa.concluida ? cores.textoSecundario : cores.tinta,
                          textDecorationLine: etapa.concluida ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {etapa.titulo}
                    </Text>
                    <Text
                      style={[
                        tipografia.apoio,
                        {
                          color: cores.textoSecundario,
                          marginTop: 4,
                          textDecorationLine: etapa.concluida ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {etapa.detalhe}
                    </Text>
                  </View>
                </View>
              </Cartao>
            </Pressable>
          ))}
        </>
      ) : null}

      {/* Grupo: Desenvolver competências */}
      {etapasCompetencias.length > 0 ? (
        <>
          <View style={styles.secaoHeader}>
            <Text style={[tipografia.secao, { color: cores.tinta }]}>
              Desenvolver Competências ({etapasCompetencias.filter((e) => e.concluida).length}/{etapasCompetencias.length})
            </Text>
          </View>

          {etapasCompetencias.map((etapa) => (
            <Pressable
              key={etapa.id}
              onPress={() => alternarEtapa(etapa.id, !etapa.concluida)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: etapa.concluida }}
              accessibilityLabel={`${etapa.titulo}. ${etapa.concluida ? 'Concluída' : 'Pendente'}`}
            >
              <Cartao
                style={[
                  etapa.concluida && {
                    opacity: 0.85,
                    backgroundColor: cores.isDark ? '#0c1a24' : '#F6F9FA',
                  },
                ]}
              >
                <View style={styles.etapaRow}>
                  {/* Caixa de seleção acessível */}
                  <View
                    style={[
                      styles.checkbox,
                      {
                        borderColor: etapa.concluida ? cores.ok : cores.linha,
                        backgroundColor: etapa.concluida ? cores.ok : 'transparent',
                      },
                    ]}
                  >
                    {etapa.concluida ? (
                      <Text style={[styles.checkMark, { color: '#FFFFFF' }]}>✓</Text>
                    ) : null}
                  </View>

                  <View style={styles.etapaTextos}>
                    <Text
                      style={[
                        tipografia.textoDestaque,
                        {
                          color: etapa.concluida ? cores.textoSecundario : cores.tinta,
                          textDecorationLine: etapa.concluida ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {etapa.titulo}
                    </Text>
                    <Text
                      style={[
                        tipografia.apoio,
                        {
                          color: cores.textoSecundario,
                          marginTop: 4,
                          textDecorationLine: etapa.concluida ? 'line-through' : 'none',
                        },
                      ]}
                    >
                      {etapa.detalhe}
                    </Text>
                  </View>
                </View>
              </Cartao>
            </Pressable>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  secaoHeader: {
    marginTop: 18,
    marginBottom: 8,
  },
  etapaRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkMark: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  etapaTextos: {
    flex: 1,
  },
});

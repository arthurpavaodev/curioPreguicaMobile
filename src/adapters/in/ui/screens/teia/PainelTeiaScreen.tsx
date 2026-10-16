import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Vaga } from '../../../../domain';
import {
  Aviso,
  BarraDeProgresso,
  Cartao,
  SeletorDeVaga,
  Selo,
} from '../../components';
import { useTEIA } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

interface PainelTeiaScreenProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
}

export function PainelTeiaScreen({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
}: PainelTeiaScreenProps) {
  const { cores } = useTheme();
  const { resumo, ranking, carregando, erro } = useTEIA(vagaSelecionadaId);

  if (carregando && !resumo) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={ranking}
        keyExtractor={(item) => item.aluno.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
              Painel do TEIA
            </Text>
            <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
              Visão geral dos estudantes cadastrados e compatibilidade com as oportunidades.
            </Text>

            <Aviso
              tipo="info"
              mensagem="Dados de exemplo. Na versão final, viriam do cadastro do TEIA."
            />

            {/* Três Indicadores */}
            {resumo ? (
              <View style={styles.indicadoresRow}>
                <Cartao style={styles.indicadorCard}>
                  <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                    CADASTRADOS
                  </Text>
                  <Text style={[tipografia.monoValor, { color: cores.tinta, marginTop: 4 }]}>
                    {resumo.cadastrados}
                  </Text>
                </Cartao>

                <Cartao style={styles.indicadorCard}>
                  <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                    COM CURRÍCULO
                  </Text>
                  <Text style={[tipografia.monoValor, { color: cores.ok, marginTop: 4 }]}>
                    {resumo.comCurriculo}
                  </Text>
                </Cartao>

                <Cartao style={styles.indicadorCard}>
                  <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                    ADERÊNCIA MÉDIA
                  </Text>
                  <Text style={[tipografia.monoValor, { color: cores.destaque, marginTop: 4 }]}>
                    {resumo.aderenciaMedia}%
                  </Text>
                </Cartao>
              </View>
            ) : null}

            {/* Seletor de Vaga */}
            <SeletorDeVaga
              vagas={vagas}
              vagaSelecionadaId={vagaSelecionadaId}
              onSelecionarVaga={onSelecionarVaga}
            />

            <View style={styles.secaoTituloRow}>
              <Text style={[tipografia.secao, { color: cores.tinta }]}>
                Ranking de Aderência
              </Text>
              <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                {ranking.length} alunos
              </Text>
            </View>
          </View>
        }
        renderItem={({ item, index }) => {
          const { aluno, aderencia, faltam } = item;
          const temCurriculo = aderencia !== null;

          let badgeVariante: 'ok' | 'atencao' | 'erro' | 'padrao' = 'padrao';
          let badgeRotulo = 'sem currículo';

          if (temCurriculo) {
            badgeRotulo = `${aderencia}%`;
            if (aderencia >= 75) badgeVariante = 'ok';
            else if (aderencia >= 45) badgeVariante = 'atencao';
            else badgeVariante = 'erro';
          }

          return (
            <Cartao>
              <View style={styles.alunoCardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                    #{index + 1} {aluno.nome}
                  </Text>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                    {aluno.modulo}º módulo
                  </Text>
                </View>

                <Selo rotulo={badgeRotulo} variante={badgeVariante} />
              </View>

              {temCurriculo ? (
                <>
                  <BarraDeProgresso
                    progresso={aderencia}
                    altura={6}
                    cor={
                      aderencia >= 75
                        ? cores.ok
                        : aderencia >= 45
                        ? cores.atencao
                        : cores.erro
                    }
                    style={{ marginVertical: 8 }}
                  />

                  {faltam.length > 0 ? (
                    <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 4 }]}>
                      <Text style={{ fontWeight: '600' }}>Falta: </Text>
                      {faltam.join(', ')}
                    </Text>
                  ) : (
                    <Text style={[tipografia.apoio, { color: cores.ok, marginTop: 4 }]}>
                      Atende a todos os requisitos da vaga!
                    </Text>
                  )}
                </>
              ) : (
                <View style={[styles.semCurriculoAviso, { backgroundColor: cores.isDark ? '#1a1815' : '#FCF8F2' }]}>
                  <Text style={[tipografia.apoio, { color: cores.atencao }]}>
                    Pedir o envio do currículo.
                  </Text>
                </View>
              )}
            </Cartao>
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
    padding: 16,
    paddingBottom: 40,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 10,
  },
  indicadoresRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 12,
  },
  indicadorCard: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  secaoTituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  alunoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  semCurriculoAviso: {
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
});

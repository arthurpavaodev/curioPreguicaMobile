import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Aviso, Botao, Cartao, Selo } from '../../components';
import { useTEIA } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

interface OportunidadesTeiaScreenProps {
  onVerRankingVaga: (vagaId: string) => void;
}

export function OportunidadesTeiaScreen({
  onVerRankingVaga,
}: OportunidadesTeiaScreenProps) {
  const { cores } = useTheme();
  const { vagas, oportunidades, carregando } = useTEIA(null);

  if (carregando && vagas.length === 0) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={vagas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
              Oportunidades Cadastradas
            </Text>
            <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
              Acompanhe a compatibilidade geral dos alunos com as vagas disponíveis.
            </Text>

            <Aviso
              tipo="info"
              mensagem="Dados de exemplo. Na versão final, viriam do cadastro do TEIA."
            />
          </View>
        }
        renderItem={({ item }) => {
          const compInfo = oportunidades[item.id] || { compativeis: 0, total: 0 };

          return (
            <Cartao>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[tipografia.secao, { color: cores.tinta }]}>
                    {item.titulo}
                  </Text>
                  <Text
                    style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}
                  >
                    {item.empresa}
                  </Text>
                </View>

                {item.origem === 'exemplo' ? (
                  <Selo rotulo="exemplo" variante="padrao" />
                ) : (
                  <Selo rotulo="empresa" variante="ok" />
                )}
              </View>

              <View
                style={[
                  styles.compatibilidadeBadge,
                  { backgroundColor: cores.isDark ? '#0d1a24' : '#F4F7F9' },
                ]}
              >
                <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                  COMPATIBILIDADE:
                </Text>
                <Text
                  style={[
                    tipografia.textoDestaque,
                    { color: compInfo.compativeis > 0 ? cores.ok : cores.textoSecundario },
                  ]}
                >
                  {compInfo.compativeis} de {compInfo.total} compatíveis (≥ 60%)
                </Text>
              </View>

              <Botao
                titulo="Ver ranking"
                onPress={() => onVerRankingVaga(item.id)}
                variante="primario"
                style={{ marginTop: 12 }}
              />
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
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  compatibilidadeBadge: {
    padding: 10,
    borderRadius: 8,
    marginVertical: 4,
  },
});

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Vaga } from '../../../../domain';
import {
  BarraDeProgresso,
  Cartao,
  EstadoVazio,
  SeletorDeVaga,
  Selo,
} from '../../components';
import { useEmpresa } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

interface CandidatosEmpresaScreenProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
}

export function CandidatosEmpresaScreen({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
}: CandidatosEmpresaScreenProps) {
  const { cores } = useTheme();
  const {
    candidatos,
    aderenciaMinima,
    aderenciaUsuario,
    carregando,
    setAderenciaMinima,
  } = useEmpresa(vagaSelecionadaId);

  if (carregando && candidatos.length === 0) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={candidatos}
        keyExtractor={(item) => item.aluno.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
              Banco de Candidatos
            </Text>
            <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
              Filtre os estudantes que atendem à exigência mínima da sua vaga.
            </Text>

            {/* Seletor de Vaga */}
            <SeletorDeVaga
              vagas={vagas}
              vagaSelecionadaId={vagaSelecionadaId}
              onSelecionarVaga={onSelecionarVaga}
            />

            {/* Controle Deslizante de Aderência Mínima */}
            <Cartao>
              <View style={styles.sliderHeaderRow}>
                <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                  ADERÊNCIA MÍNIMA EXIGIDA
                </Text>
                <Text style={[tipografia.monoValor, { color: cores.destaque }]}>
                  {aderenciaMinima}%
                </Text>
              </View>

              <Slider
                minimumValue={0}
                maximumValue={100}
                step={5}
                value={aderenciaMinima}
                onValueChange={setAderenciaMinima}
                minimumTrackTintColor={cores.destaque}
                maximumTrackTintColor={cores.linha}
                thumbTintColor={cores.destaque}
                style={styles.slider}
                accessibilityRole="adjustable"
                accessibilityLabel={`Aderência mínima de ${aderenciaMinima}%`}
              />

              <View style={styles.sliderLimitsRow}>
                <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>0%</Text>
                <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>50%</Text>
                <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>100%</Text>
              </View>
            </Cartao>

            <View style={styles.secaoTituloRow}>
              <Text style={[tipografia.secao, { color: cores.tinta }]}>
                Candidatos Qualificados
              </Text>
              <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                {candidatos.length} {candidatos.length === 1 ? 'aluno' : 'alunos'}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EstadoVazio
            titulo="Nenhum candidato atingiu a nota de corte"
            mensagem={`Nenhum estudante atingiu ${aderenciaMinima}% de aderência para esta vaga. Experimente reduzir a aderência mínima no controle acima.`}
          />
        }
        renderItem={({ item, index }) => {
          const { aluno, aderencia, faltam } = item;
          const valorAderencia = aderencia ?? 0;

          return (
            <Cartao>
              <View style={styles.candidatoHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                    #{index + 1} {aluno.nome}
                  </Text>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                    {aluno.modulo}º módulo
                  </Text>
                </View>

                <Selo
                  rotulo={`${valorAderencia}%`}
                  variante={valorAderencia >= 75 ? 'ok' : 'atencao'}
                />
              </View>

              <BarraDeProgresso
                progresso={valorAderencia}
                altura={6}
                cor={valorAderencia >= 75 ? cores.ok : cores.atencao}
                style={{ marginVertical: 8 }}
              />

              {faltam.length > 0 ? (
                <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 4 }]}>
                  <Text style={{ fontWeight: '600' }}>Falta desenvolver: </Text>
                  {faltam.join(', ')}
                </Text>
              ) : (
                <Text style={[tipografia.apoio, { color: cores.ok, marginTop: 4 }]}>
                  Atende a 100% dos requisitos exigidos!
                </Text>
              )}
            </Cartao>
          );
        }}
        ListFooterComponent={
          aderenciaUsuario !== null ? (
            <View
              style={[
                styles.discretoUsuarioBox,
                {
                  backgroundColor: cores.superficie,
                  borderColor: cores.linha,
                },
              ]}
            >
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                SEU PRÓPRIO CURRÍCULO NESTA VAGA:
              </Text>
              <Text
                style={[
                  tipografia.textoDestaque,
                  {
                    color: aderenciaUsuario >= 75 ? cores.ok : cores.tinta,
                    marginTop: 2,
                  },
                ]}
              >
                {aderenciaUsuario}% de aderência calculada
              </Text>
            </View>
          ) : null
        }
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
  sliderHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLimitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  secaoTituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  candidatoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  discretoUsuarioBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    alignItems: 'center',
  },
});

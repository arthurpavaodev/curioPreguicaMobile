import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Aviso,
  Botao,
  CampoDeTexto,
  Cartao,
  Selo,
} from '../../components';
import { useCurriculo } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

export function CurriculoScreen() {
  const { cores } = useTheme();
  const {
    curriculo,
    texto,
    carregando,
    salvando,
    isExemplo,
    atualizarTexto,
    usarExemplo,
    limpar,
    carregarDeArquivo,
  } = useCurriculo();

  const secoes = curriculo?.secoesDetectadas || {
    objetivo: false,
    formacao: false,
    projetos: false,
    habilidades: false,
    idiomas: false,
  };

  const palavrasCount = curriculo?.palavras || 0;

  if (carregando) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: cores.fundo }]}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
          Meu Currículo
        </Text>
        <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
          Cole seu currículo em texto ou carregue um arquivo .txt para comparar com as vagas.
        </Text>

        {isExemplo ? (
          <Aviso
            tipo="atencao"
            mensagem="Você está usando o currículo de exemplo com dados fictícios. Edite ou limpe para usar o seu."
          />
        ) : null}

        {/* Barra de ações e estatísticas */}
        <Cartao>
          <View style={styles.topStatusRow}>
            <View>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                EXTENSÃO DO TEXTO
              </Text>
              <Text style={[tipografia.monoValor, { color: cores.tinta, marginTop: 2 }]}>
                {palavrasCount} {palavrasCount === 1 ? 'palavra' : 'palavras'}
              </Text>
            </View>

            <View style={styles.salvamentoBadge}>
              <Text
                style={[
                  tipografia.apoio,
                  { color: salvando ? cores.destaque : cores.ok, fontStyle: 'italic' },
                ]}
              >
                {salvando ? 'Salvando...' : 'Salvo'}
              </Text>
            </View>
          </View>

          {/* Chips de seções detectadas */}
          <View style={styles.secoesContainer}>
            <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 8 }]}>
              SEÇÕES DETECTADAS
            </Text>
            <View style={styles.chipsRow}>
              <Selo
                rotulo="Objetivo"
                variante={secoes.objetivo ? 'ok' : 'padrao'}
                style={styles.chip}
              />
              <Selo
                rotulo="Formação"
                variante={secoes.formacao ? 'ok' : 'padrao'}
                style={styles.chip}
              />
              <Selo
                rotulo="Projetos"
                variante={secoes.projetos ? 'ok' : 'padrao'}
                style={styles.chip}
              />
              <Selo
                rotulo="Habilidades"
                variante={secoes.habilidades ? 'ok' : 'padrao'}
                style={styles.chip}
              />
              <Selo
                rotulo="Idiomas"
                variante={secoes.idiomas ? 'ok' : 'padrao'}
                style={styles.chip}
              />
            </View>
          </View>

          {/* Botões de Ação */}
          <View style={styles.botoesRow}>
            <Botao
              titulo="Arquivo .txt"
              onPress={carregarDeArquivo}
              variante="padrao"
              style={styles.botaoAcao}
            />
            <Botao
              titulo="Usar exemplo"
              onPress={usarExemplo}
              variante="padrao"
              style={styles.botaoAcao}
            />
            <Botao
              titulo="Limpar"
              onPress={limpar}
              variante="fantasma"
              style={styles.botaoAcao}
            />
          </View>
        </Cartao>

        {/* Campo de texto do currículo */}
        <CampoDeTexto
          rotulo="TEXTO DO CURRÍCULO"
          placeholder="Cole seu currículo aqui..."
          multiline
          value={texto}
          onChangeText={atualizarTexto}
          inputStyle={{ minHeight: 320, fontSize: 14, lineHeight: 21 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  salvamentoBadge: {
    alignItems: 'flex-end',
  },
  secoesContainer: {
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    marginRight: 4,
    marginBottom: 4,
  },
  botoesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  botaoAcao: {
    flex: 1,
    paddingHorizontal: 8,
  },
});

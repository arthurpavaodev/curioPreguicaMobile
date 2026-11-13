import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../../app/providers/ThemeProvider';
import {
  Badge,
  Button,
  Card,
  ErrorState,
  Input,
} from '../../../components';
import { spacing, tipografia } from '../../../theme';
import { useCurriculum } from '../hooks/useCurriculum';

export function CurriculumScreen() {
  const { cores } = useTheme();
  const {
    curriculo,
    texto,
    analise,
    carregando,
    erro,
    atualizarTexto,
    usarExemplo,
    limpar,
    importarPdf,
  } = useCurriculum();

  const [mostrarEditor, setMostrarEditor] = useState(false);

  const { secoesDetectadas, totalPalavras, competenciasReconhecidas } = analise;

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
        <View style={styles.headerBlock}>
          <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
            Meu Currículo
          </Text>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
            Importe seu PDF ou edite o texto para atualizar sua compatibilidade com as vagas.
          </Text>
        </View>

        {erro ? <ErrorState mensagem={erro} /> : null}

        {/* Card de Resumo e Importação */}
        <Card>
          <View style={[styles.statsBar, { borderBottomColor: cores.linha }]}>
            <View style={styles.statItem}>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                PALAVRAS
              </Text>
              <Text style={[tipografia.monoValor, { color: cores.tinta, marginTop: 2 }]}>
                {totalPalavras}
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: cores.linha }]} />

            <View style={styles.statItem}>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                SKILLS
              </Text>
              <Text style={[tipografia.monoValor, { color: cores.destaque, marginTop: 2 }]}>
                {competenciasReconhecidas.length}
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: cores.linha }]} />

            <View style={styles.statItem}>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                ARQUIVO
              </Text>
              <Text
                style={[
                  tipografia.textoDestaque,
                  {
                    color: curriculo.nomeArquivo ? cores.ok : cores.laranjaDestaque,
                    marginTop: 4,
                  },
                ]}
                numberOfLines={1}
              >
                {curriculo.nomeArquivo ? 'PDF ✓' : 'Exemplo'}
              </Text>
            </View>
          </View>

          <Button
            titulo="Importar Currículo em PDF (.pdf)"
            onPress={importarPdf}
            variante="primario"
            style={{ marginTop: spacing.md }}
          />

          <View style={styles.secondaryActionsRow}>
            <Button
              titulo="Restaurar exemplo"
              onPress={usarExemplo}
              variante="padrao"
              compacto
              style={styles.secondaryBtn}
            />
            <Button
              titulo="Limpar"
              onPress={limpar}
              variante="fantasma"
              compacto
              style={styles.secondaryBtn}
            />
          </View>
        </Card>

        {/* Seções e Competências Identificadas */}
        <Card>
          <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
            SEÇÕES IDENTIFICADAS
          </Text>
          <View style={styles.chipsRow}>
            <Badge
              rotulo={secoesDetectadas.objetivo ? '✓ Objetivo' : 'Objetivo'}
              variante={secoesDetectadas.objetivo ? 'ok' : 'padrao'}
            />
            <Badge
              rotulo={secoesDetectadas.formacao ? '✓ Formação' : 'Formação'}
              variante={secoesDetectadas.formacao ? 'ok' : 'padrao'}
            />
            <Badge
              rotulo={secoesDetectadas.projetos ? '✓ Projetos/Exp.' : 'Projetos/Exp.'}
              variante={secoesDetectadas.projetos ? 'ok' : 'padrao'}
            />
            <Badge
              rotulo={secoesDetectadas.habilidades ? '✓ Habilidades' : 'Habilidades'}
              variante={secoesDetectadas.habilidades ? 'ok' : 'padrao'}
            />
            <Badge
              rotulo={secoesDetectadas.idiomas ? '✓ Idiomas' : 'Idiomas'}
              variante={secoesDetectadas.idiomas ? 'ok' : 'padrao'}
            />
          </View>

          {competenciasReconhecidas.length > 0 ? (
            <>
              <Text
                style={[
                  tipografia.rotulo,
                  { color: cores.textoSecundario, marginTop: spacing.md },
                ]}
              >
                COMPETÊNCIAS MAPEADAS ({competenciasReconhecidas.length})
              </Text>
              <View style={styles.chipsRow}>
                {competenciasReconhecidas.map((comp) => (
                  <Badge key={comp.id} rotulo={comp.rotulo} variante="destaque" />
                ))}
              </View>
            </>
          ) : null}
        </Card>

        {/* Editor de Texto Retrátil (evita poluir a tela com texto longo) */}
        <Card>
          <Pressable
            onPress={() => setMostrarEditor(!mostrarEditor)}
            style={styles.editorToggleHeader}
            accessibilityRole="button"
          >
            <View style={{ flex: 1 }}>
              <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                Texto do Currículo
              </Text>
              {!mostrarEditor ? (
                <Text
                  style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}
                  numberOfLines={2}
                >
                  {texto.trim() || 'Nenhum texto informado.'}
                </Text>
              ) : null}
            </View>
            <Text style={[tipografia.textoDestaque, { color: cores.destaque, marginLeft: 8 }]}>
              {mostrarEditor ? 'Ocultar ▲' : 'Editar ▼'}
            </Text>
          </Pressable>

          {mostrarEditor ? (
            <View style={{ marginTop: spacing.sm }}>
              <Input
                placeholder="Cole ou edite o conteúdo do seu currículo..."
                multiline
                value={texto}
                onChangeText={atualizarTexto}
                inputStyle={{ minHeight: 200, fontSize: 13.5, lineHeight: 20 }}
              />
            </View>
          ) : null}
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  secondaryBtn: {
    flex: 1,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  editorToggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

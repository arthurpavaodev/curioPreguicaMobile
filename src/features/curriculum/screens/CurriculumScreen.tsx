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
import { useTheme } from '../../../app/providers/ThemeProvider';
import {
  Badge,
  Button,
  Card,
  ErrorState,
  Input,
  NoticeBanner,
} from '../../../components';
import { fontNames, spacing, tipografia } from '../../../theme';
import { useCurriculum } from '../hooks/useCurriculum';

export function CurriculumScreen() {
  const { cores } = useTheme();
  const {
    curriculo,
    texto,
    isExemplo,
    analise,
    carregando,
    salvando,
    erro,
    atualizarTexto,
    usarExemplo,
    limpar,
    importarPdf,
  } = useCurriculum();

  const { secoesDetectadas, totalPalavras, competenciasReconhecidas, pontosFracos, ortografia } =
    analise;

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
        {/* Cabeçalho Centralizado Estilo CREA-MA */}
        <View style={styles.centeredHeader}>
          <Text style={[styles.overlineTag, { color: cores.destaque }]}>PERFIL DO CANDIDATO</Text>
          <Text style={[styles.mainTitle, { color: cores.tinta }]}>
            Importe seu{' '}
            <Text style={{ color: cores.laranjaDestaque }}>currículo em PDF</Text>
            {'\n'}e decole!
          </Text>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario, textAlign: 'center', marginTop: 4 }]}>
            Envie seu currículo em PDF (obrigatório). O sistema extrai o texto do PDF e cruza com as palavras-chave das vagas para calcular sua compatibilidade real.
          </Text>
        </View>

        {erro ? <ErrorState mensagem={erro} /> : null}

        {curriculo.nomeArquivo ? (
          <NoticeBanner
            tipo="info"
            titulo={`PDF Selecionado: ${curriculo.nomeArquivo}`}
            mensagem="Texto do PDF extraído com sucesso. Suas palavras-chave estão sincronizadas com o painel de vagas."
          />
        ) : isExemplo ? (
          <NoticeBanner
            tipo="atencao"
            titulo="Currículo demonstrativo ativo"
            mensagem="Estes dados são demonstrativos da UNDB. Toque em 'Importar PDF' para carregar seu arquivo oficial (.pdf)."
          />
        ) : null}

        {/* Card Bento de Métricas e Ações */}
        <Card>
          <View style={styles.statsBar}>
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
                COMPETÊNCIAS
              </Text>
              <Text style={[tipografia.monoValor, { color: cores.destaque, marginTop: 2 }]}>
                {competenciasReconhecidas.length}
              </Text>
            </View>

            <View style={[styles.statDivider, { backgroundColor: cores.linha }]} />

            <View style={styles.statItem}>
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                FORMATO
              </Text>
              <Text
                style={[
                  tipografia.textoDestaque,
                  { color: curriculo.nomeArquivo ? cores.ok : cores.laranjaDestaque, marginTop: 4 },
                ]}
              >
                {curriculo.nomeArquivo ? 'PDF ✓' : 'Exemplo'}
              </Text>
            </View>
          </View>

          <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginTop: 14 }]}>
            ESTRUTURA RECONHECIDA NO PDF
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

          <View style={styles.actionsRow}>
            <Button
              titulo="Importar PDF (.pdf)  📄"
              onPress={importarPdf}
              variante="primario"
              compacto
              style={styles.actionBtnPrimary}
            />
          </View>
          <View style={[styles.actionsRow, { marginTop: spacing.xs }]}>
            <Button
              titulo="Usar exemplo"
              onPress={usarExemplo}
              variante="padrao"
              compacto
              style={styles.actionBtn}
            />
            <Button
              titulo="Limpar"
              onPress={limpar}
              variante="perigo"
              compacto
              style={styles.actionBtn}
            />
          </View>
        </Card>

        {/* Editor de texto / Visualizador do PDF extraído */}
        <Input
          rotulo="TEXTO EXTRAÍDO DO CURRÍCULO (PDF)"
          placeholder="Importe seu arquivo .pdf para extrair automaticamente o texto, ou ajuste os dados aqui..."
          multiline
          value={texto}
          onChangeText={atualizarTexto}
          inputStyle={{ minHeight: 270, fontSize: 13.5, lineHeight: 20 }}
        />

        {/* Competências reconhecidas no currículo */}
        {competenciasReconhecidas.length > 0 ? (
          <Card>
            <Text style={[tipografia.rotulo, { color: cores.destaque, marginBottom: 8 }]}>
              COMPETÊNCIAS MAPEADAS NO SEU PERFIL ({competenciasReconhecidas.length})
            </Text>
            <View style={styles.chipsRow}>
              {competenciasReconhecidas.map((comp) => (
                <Badge key={comp.id} rotulo={comp.rotulo} variante="destaque" />
              ))}
            </View>
          </Card>
        ) : null}

        {/* Alertas estruturais e ortográficos */}
        {(pontosFracos.length > 0 || ortografia.length > 0) && (
          <Card semPadding>
            <View
              style={[
                styles.compactBoxHeader,
                {
                  backgroundColor: cores.superficieSecundaria,
                  borderBottomColor: cores.linha,
                },
              ]}
            >
              <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                SUGESTÕES DE CLAREZA E ESCRITA ({pontosFracos.length + ortografia.length})
              </Text>
            </View>

            <View style={styles.compactListBody}>
              {pontosFracos.map((pf, index) => (
                <View key={`pf_${index}`} style={styles.compactAlertItem}>
                  <Text style={[styles.bulletDot, { color: cores.laranjaDestaque }]}>•</Text>
                  <Text style={[tipografia.apoio, { color: cores.tinta, flex: 1 }]}>{pf}</Text>
                </View>
              ))}

              {ortografia.map((item, index) => (
                <View key={`orto_${index}`} style={styles.compactAlertItem}>
                  <Text style={[styles.bulletDot, { color: cores.erro }]}>!</Text>
                  <Text style={[tipografia.apoio, { color: cores.tinta, flex: 1 }]}>
                    Revisão: <Text style={{ fontWeight: '600' }}>{item.rotulo}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}
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
    paddingBottom: 40,
  },
  centralizado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  overlineTag: {
    fontFamily: fontNames.plexSans600,
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  statsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#ECEEF2',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 32,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  actionBtnPrimary: {
    flex: 1,
    minHeight: 44,
  },
  compactBoxHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  compactListBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 6,
  },
  compactAlertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    fontWeight: '700',
    fontSize: 14,
    marginRight: 8,
    lineHeight: 18,
  },
});

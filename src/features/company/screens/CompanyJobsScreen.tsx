import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
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
  ErrorState,
  Input,
  NoticeBanner,
} from '../../../components';
import { spacing, tipografia } from '../../../theme';

export interface CompanyJobsScreenProps {
  onVerCandidatosVaga: (vagaId: string) => void;
}

export function CompanyJobsScreen({ onVerCandidatosVaga }: CompanyJobsScreenProps) {
  const { cores } = useTheme();
  const { vagasVisiveis, erro, selecionarVaga, adicionarVaga, removerVaga } = useAppData();

  const [formAberto, setFormAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [descricao, setDescricao] = useState('');
  const [palavrasChaveTexto, setPalavrasChaveTexto] = useState('');
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [cadastrando, setCadastrando] = useState(false);

  const handleCadastrarVaga = async () => {
    setErroForm(null);
    if (titulo.trim().length < 3 || descricao.trim().length < 10) {
      setErroForm('Informe o título e a descrição da vaga (mínimo 10 caracteres).');
      return;
    }

    try {
      setCadastrando(true);
      const criada = await adicionarVaga({
        titulo: titulo.trim(),
        empresa: empresa.trim() || 'Minha Empresa',
        texto: descricao.trim(),
        origem: 'empresa',
        palavrasChave: palavrasChaveTexto,
      });
      setTitulo('');
      setEmpresa('');
      setDescricao('');
      setPalavrasChaveTexto('');
      setFormAberto(false);
      onVerCandidatosVaga(criada.id);
    } catch (e) {
      setErroForm(e instanceof Error ? e.message : 'Erro ao cadastrar vaga');
    } finally {
      setCadastrando(false);
    }
  };

  const confirmarRemocao = (id: string, tituloVaga: string) => {
    Alert.alert('Remover vaga', `Deseja remover a vaga "${tituloVaga}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removerVaga(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={vagasVisiveis}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
              Vagas da Empresa
            </Text>
            <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2, marginBottom: 12 }]}>
              Publique oportunidades e avalie quais estudantes atendem aos requisitos.
            </Text>

            <NoticeBanner
              tipo="info"
              titulo="Ambiente local de demonstração"
              mensagem="As vagas publicadas aqui ficam salvas neste dispositivo e ficam imediatamente visíveis nos perfis Aluno e TEIA."
            />

            {erro ? <ErrorState mensagem={erro} /> : null}

            {/* Formulário Nova Vaga */}
            <Card style={styles.formCard}>
              <Pressable
                onPress={() => setFormAberto(!formAberto)}
                style={styles.toggleFormHeader}
                accessibilityRole="button"
                accessibilityLabel={formAberto ? 'Fechar formulário de nova vaga' : 'Publicar nova vaga'}
              >
                <Text style={[tipografia.textoDestaque, { color: cores.destaque }]}>
                  {formAberto ? '▲ Fechar formulário' : '+ Publicar nova vaga'}
                </Text>
              </Pressable>

              {formAberto ? (
                <View style={styles.formBody}>
                  <Input
                    rotulo="TÍTULO DA VAGA"
                    placeholder="Ex: Desenvolvedor Mobile Júnior"
                    value={titulo}
                    onChangeText={setTitulo}
                  />

                  <Input
                    rotulo="NOME DA EMPRESA"
                    placeholder="Ex: Minha Empresa Tech"
                    value={empresa}
                    onChangeText={setEmpresa}
                  />

                  <Input
                    rotulo="PALAVRAS-CHAVE DA VAGA (SEPARADAS POR VÍRGULA)"
                    placeholder="Ex: React Native, TypeScript, Git, SQL, Firebase"
                    value={palavrasChaveTexto}
                    onChangeText={setPalavrasChaveTexto}
                  />

                  <Input
                    rotulo="DESCRIÇÃO E REQUISITOS"
                    placeholder="Liste os requisitos obrigatórios e diferenciais..."
                    multiline
                    value={descricao}
                    onChangeText={setDescricao}
                    inputStyle={{ minHeight: 110 }}
                    erro={erroForm || undefined}
                  />

                  <Button
                    titulo="Publicar vaga"
                    onPress={handleCadastrarVaga}
                    variante="primario"
                    carregando={cadastrando}
                  />
                </View>
              ) : null}
            </Card>

            <View style={styles.secaoTituloRow}>
              <Text style={[tipografia.secao, { color: cores.tinta }]}>
                Vagas Publicadas
              </Text>
              <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                {vagasVisiveis.length} {vagasVisiveis.length === 1 ? 'vaga' : 'vagas'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={styles.jobCard}>
            <View style={styles.cardHeader}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text style={[tipografia.subtitulo, { color: cores.tinta }]}>
                  {item.titulo}
                </Text>
                <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                  {item.empresa} · {item.palavrasChave?.length || item.requisitos.length} palavras-chave
                </Text>
              </View>

              <Badge
                rotulo={item.origem === 'exemplo' ? 'exemplo' : 'sua empresa'}
                variante={item.origem === 'exemplo' ? 'padrao' : 'ok'}
              />
            </View>

            {item.palavrasChave && item.palavrasChave.length > 0 && (
              <View style={styles.keywordChipsRow}>
                {item.palavrasChave.slice(0, 6).map((kw, i) => (
                  <Badge key={i} rotulo={kw} variante="padrao" />
                ))}
                {item.palavrasChave.length > 6 && (
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, alignSelf: 'center' }]}>
                    +{item.palavrasChave.length - 6}
                  </Text>
                )}
              </View>
            )}

            <View style={[styles.cardActions, { borderTopColor: cores.linha }]}>
              <View style={{ flexDirection: 'row', gap: spacing.xs, marginLeft: 'auto' }}>
                {item.origem !== 'exemplo' ? (
                  <Button
                    titulo="Remover"
                    onPress={() => confirmarRemocao(item.id, item.titulo)}
                    variante="fantasma"
                    compacto
                  />
                ) : null}

                <Button
                  titulo="Ver candidatos"
                  onPress={async () => {
                    await selecionarVaga(item.id);
                    onVerCandidatosVaga(item.id);
                  }}
                  variante="primario"
                  compacto
                />
              </View>
            </View>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: 40,
  },
  header: {
    marginBottom: spacing.xs,
  },
  formCard: {
    paddingVertical: spacing.md,
  },
  toggleFormHeader: {
    paddingVertical: 2,
    alignItems: 'center',
  },
  formBody: {
    marginTop: spacing.md,
  },
  secaoTituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  jobCard: {
    paddingVertical: spacing.md,
  },
  keywordChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
});

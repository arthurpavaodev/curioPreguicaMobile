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
            <View style={styles.topHeaderRow}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
                  Minhas Vagas
                </Text>
                <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                  Gerencie suas oportunidades e veja os candidatos compatíveis.
                </Text>
              </View>

              <Button
                titulo={formAberto ? 'Fechar' : '+ Nova vaga'}
                onPress={() => setFormAberto(!formAberto)}
                variante={formAberto ? 'padrao' : 'primario'}
                compacto
              />
            </View>

            {erro ? <ErrorState mensagem={erro} /> : null}

            {formAberto ? (
              <Card style={styles.formCard}>
                <Input
                  rotulo="TÍTULO DA VAGA"
                  placeholder="Ex: Desenvolvedor Mobile Júnior"
                  value={titulo}
                  onChangeText={setTitulo}
                />

                <Input
                  rotulo="EMPRESA"
                  placeholder="Ex: Minha Empresa Tech"
                  value={empresa}
                  onChangeText={setEmpresa}
                />

                <Input
                  rotulo="PALAVRAS-CHAVE (OPCIONAL, SEPARADAS POR VÍRGULA)"
                  placeholder="Ex: React Native, TypeScript, Git, SQL"
                  value={palavrasChaveTexto}
                  onChangeText={setPalavrasChaveTexto}
                />

                <Input
                  rotulo="DESCRIÇÃO E REQUISITOS"
                  placeholder="Liste os requisitos obrigatórios e diferenciais..."
                  multiline
                  value={descricao}
                  onChangeText={setDescricao}
                  inputStyle={{ minHeight: 90 }}
                  erro={erroForm || undefined}
                />

                <Button
                  titulo="Publicar vaga →"
                  onPress={handleCadastrarVaga}
                  variante="primario"
                  carregando={cadastrando}
                />
              </Card>
            ) : null}
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
                  {item.empresa} · {item.requisitos.length} requisitos mapeados
                </Text>
              </View>

              <Badge
                rotulo={item.origem === 'exemplo' ? 'Exemplo' : 'Ativa'}
                variante={item.origem === 'exemplo' ? 'padrao' : 'ok'}
              />
            </View>

            <View style={[styles.cardActions, { borderTopColor: cores.linha }]}>
              {item.origem !== 'exemplo' ? (
                <Pressable
                  onPress={() => confirmarRemocao(item.id, item.titulo)}
                  hitSlop={8}
                >
                  <Text style={[tipografia.apoio, { color: cores.erro, fontWeight: '600' }]}>
                    Remover
                  </Text>
                </Pressable>
              ) : (
                <View />
              )}

              <Button
                titulo="Ver candidatos →"
                onPress={async () => {
                  await selecionarVaga(item.id);
                  onVerCandidatosVaga(item.id);
                }}
                variante="primario"
                compacto
              />
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
    paddingBottom: 36,
  },
  header: {
    marginBottom: spacing.xs,
  },
  topHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  formCard: {
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  jobCard: {
    paddingVertical: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
});

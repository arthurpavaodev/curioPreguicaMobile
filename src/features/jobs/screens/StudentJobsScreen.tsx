import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAppData } from '../../../app/providers/AppDataProvider';
import { useTheme } from '../../../app/providers/ThemeProvider';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  Input,
} from '../../../components';
import { fontNames, radius, spacing, tipografia } from '../../../theme';

export interface StudentJobsScreenProps {
  onNavegarParaDiagnostico: (vagaId: string) => void;
}

type FiltroAbaVagas = 'todas' | 'compativeis' | 'minhas';

export function StudentJobsScreen({ onNavegarParaDiagnostico }: StudentJobsScreenProps) {
  const { cores } = useTheme();
  const {
    vagasComDiagnostico,
    erro,
    selecionarVaga,
    adicionarVaga,
    removerVaga,
    candidatarVaga,
    jaCandidatouNaVaga,
  } = useAppData();

  const [busca, setBusca] = useState('');
  const [abaFiltro, setAbaFiltro] = useState<FiltroAbaVagas>('todas');

  const [formAberto, setFormAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [adicionando, setAdicionando] = useState(false);

  const vagasFiltradas = useMemo(() => {
    return vagasComDiagnostico.filter(({ vaga, aderencia }) => {
      if (abaFiltro === 'compativeis' && (aderencia === null || aderencia < 60)) {
        return false;
      }
      if (abaFiltro === 'minhas' && vaga.origem !== 'aluno') {
        return false;
      }
      if (!busca.trim()) return true;
      const termo = busca.toLowerCase();
      return (
        vaga.titulo.toLowerCase().includes(termo) ||
        vaga.empresa.toLowerCase().includes(termo) ||
        vaga.descricao.toLowerCase().includes(termo)
      );
    });
  }, [vagasComDiagnostico, abaFiltro, busca]);

  const handleAdicionarVaga = async () => {
    setErroForm(null);
    if (novoTitulo.trim().length < 3 || novaDescricao.trim().length < 10) {
      setErroForm('Informe o título e a descrição da vaga (mínimo 10 caracteres).');
      return;
    }

    try {
      setAdicionando(true);
      const criada = await adicionarVaga({
        titulo: novoTitulo.trim(),
        empresa: novaEmpresa.trim() || undefined,
        texto: novaDescricao.trim(),
        origem: 'aluno',
      });
      setNovoTitulo('');
      setNovaEmpresa('');
      setNovaDescricao('');
      setFormAberto(false);
      onNavegarParaDiagnostico(criada.id);
    } catch (e) {
      setErroForm(e instanceof Error ? e.message : 'Erro ao adicionar vaga');
    } finally {
      setAdicionando(false);
    }
  };

  const confirmarRemocao = (id: string, titulo: string) => {
    Alert.alert('Remover vaga', `Deseja remover a vaga "${titulo}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removerVaga(id) },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={vagasFiltradas}
        keyExtractor={(item) => item.vaga.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topHeaderRow}>
              <View style={{ flex: 1, marginRight: spacing.sm }}>
                <Text style={[tipografia.tituloTela, { color: cores.tinta }]}>
                  Vagas
                </Text>
                <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                  Escolha uma vaga para diagnosticar ou candidatar-se.
                </Text>
              </View>

              <Button
                titulo={formAberto ? 'Fechar' : '+ Simular vaga'}
                onPress={() => setFormAberto(!formAberto)}
                variante={formAberto ? 'padrao' : 'primario'}
                compacto
              />
            </View>

            {formAberto ? (
              <Card style={styles.formCard}>
                <Input
                  rotulo="TÍTULO DA VAGA"
                  placeholder="Ex: Estágio em Desenvolvimento Web"
                  value={novoTitulo}
                  onChangeText={setNovoTitulo}
                />

                <Input
                  rotulo="EMPRESA (OPCIONAL)"
                  placeholder="Ex: Empresa de Tecnologia"
                  value={novaEmpresa}
                  onChangeText={setNovaEmpresa}
                />

                <Input
                  rotulo="DESCRIÇÃO E REQUISITOS"
                  placeholder="Cole os requisitos obrigatórios e diferenciais..."
                  multiline
                  value={novaDescricao}
                  onChangeText={setNovaDescricao}
                  inputStyle={{ minHeight: 90 }}
                  erro={erroForm || undefined}
                />

                <Button
                  titulo="Analisar Vaga →"
                  onPress={handleAdicionarVaga}
                  variante="primario"
                  carregando={adicionando}
                />
              </Card>
            ) : null}

            {/* Barra de Busca */}
            <View
              style={[
                styles.searchInputWrap,
                {
                  backgroundColor: cores.superficie,
                  borderColor: cores.linha,
                },
              ]}
            >
              <Text style={{ fontSize: 13, marginRight: 8 }}>🔍</Text>
              <TextInput
                placeholder="Buscar vaga ou tecnologia..."
                placeholderTextColor={cores.textoSecundario}
                value={busca}
                onChangeText={setBusca}
                style={[styles.searchInput, { color: cores.tinta }]}
                returnKeyType="search"
              />
              {busca.length > 0 ? (
                <Pressable onPress={() => setBusca('')} hitSlop={8}>
                  <Text style={{ color: cores.textoSecundario, fontSize: 13, fontWeight: '700' }}>
                    ✕
                  </Text>
                </Pressable>
              ) : null}
            </View>

            {/* Filtros */}
            <View style={styles.pillFilterRow}>
              {(
                [
                  { id: 'todas', rotulo: 'Todas' },
                  { id: 'compativeis', rotulo: 'Compatíveis (≥60%)' },
                  { id: 'minhas', rotulo: 'Simuladas' },
                ] as { id: FiltroAbaVagas; rotulo: string }[]
              ).map((tab) => {
                const ativa = abaFiltro === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setAbaFiltro(tab.id)}
                    style={[
                      styles.filterPill,
                      {
                        backgroundColor: ativa ? cores.destaque : cores.superficie,
                        borderColor: ativa ? cores.destaque : cores.linha,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterPillText,
                        {
                          color: ativa ? '#FFFFFF' : cores.tinta,
                          fontFamily: ativa ? fontNames.plexSans600 : fontNames.plexSans500,
                        },
                      ]}
                    >
                      {tab.rotulo}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {erro ? <ErrorState mensagem={erro} /> : null}
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            titulo="Nenhuma vaga encontrada"
            mensagem="Altere o filtro ou adicione uma vaga simulada."
            acaoTitulo="Ver todas"
            onAcao={() => {
              setBusca('');
              setAbaFiltro('todas');
            }}
          />
        }
        renderItem={({ item }) => {
          const { vaga, aderencia, diagnostico } = item;

          return (
            <Card style={styles.jobCard}>
              <View style={styles.cardTopRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={[styles.jobTitle, { color: cores.tinta }]}>
                    {vaga.titulo}
                  </Text>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}>
                    {vaga.empresa} · {diagnostico.requisitosAtendidosCount}/
                    {diagnostico.totalRequisitos} requisitos
                  </Text>
                </View>

                <Badge
                  rotulo={aderencia !== null ? `${aderencia}%` : '—'}
                  variante={
                    aderencia === null
                      ? 'padrao'
                      : aderencia >= 75
                      ? 'ok'
                      : aderencia >= 45
                      ? 'destaque'
                      : 'atencao'
                  }
                />
              </View>

              <View style={[styles.actionsRow, { borderTopColor: cores.linha }]}>
                <View style={styles.leftActions}>
                  {jaCandidatouNaVaga(vaga.id) ? (
                    <Badge rotulo="Inscrito ✓" variante="ok" />
                  ) : (
                    <Button
                      titulo="Candidatar-se"
                      onPress={async () => {
                        const ok = await candidatarVaga(vaga.id);
                        if (ok) {
                          Alert.alert(
                            'Candidatura enviada!',
                            `Sua candidatura para "${vaga.titulo}" foi registrada.`,
                          );
                        }
                      }}
                      variante="padrao"
                      compacto
                    />
                  )}

                  {vaga.origem !== 'exemplo' ? (
                    <Pressable
                      onPress={() => confirmarRemocao(vaga.id, vaga.titulo)}
                      hitSlop={8}
                      style={{ marginLeft: 8 }}
                    >
                      <Text style={[tipografia.apoio, { color: cores.erro, fontWeight: '600' }]}>
                        Remover
                      </Text>
                    </Pressable>
                  ) : null}
                </View>

                <Button
                  titulo="Diagnosticar →"
                  onPress={async () => {
                    await selecionarVaga(vaga.id);
                    onNavegarParaDiagnostico(vaga.id);
                  }}
                  variante="primario"
                  compacto
                />
              </View>
            </Card>
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
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    minHeight: 42,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontFamily: fontNames.plexSans400,
    fontSize: 13.5,
    paddingVertical: 8,
  },
  pillFilterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.md,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillText: {
    fontSize: 12,
  },
  jobCard: {
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

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
  ProgressBar,
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
      setErroForm('Informe o título e a descrição da vaga (mínimo 10 caracteres na descrição).');
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
            {/* Cabeçalho Centralizado Estilo CREA-MA */}
            <View style={styles.centeredHeader}>
              <Text style={[styles.overlineTag, { color: cores.destaque }]}>
                BANCO DE OPORTUNIDADES
              </Text>
              <Text style={[styles.mainTitle, { color: cores.tinta }]}>
                Encontre a vaga certa{'\n'}para o seu{' '}
                <Text style={{ color: cores.laranjaDestaque }}>perfil!</Text>
              </Text>
            </View>

            {/* Barra de Busca com Círculo Preto de Lupa Estilo "Triagem" do CREA-MA */}
            <View style={styles.searchRow}>
              <View
                style={[
                  styles.searchInputWrap,
                  { backgroundColor: cores.superficie, borderColor: cores.linha },
                ]}
              >
                <TextInput
                  placeholder="Buscar por vaga, empresa ou tecnologia..."
                  placeholderTextColor={cores.textoSecundario}
                  value={busca}
                  onChangeText={setBusca}
                  style={[styles.searchInput, { color: cores.tinta }]}
                />
              </View>
              <View style={[styles.blackSearchCircle, { backgroundColor: cores.tinta }]}>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '700' }}>⌕</Text>
              </View>
            </View>

            {/* Filtros em Pílula Estilo Navbar CREA-MA */}
            <View style={styles.pillFilterRow}>
              {(
                [
                  { id: 'todas', rotulo: 'Todas' },
                  { id: 'compativeis', rotulo: 'Compatíveis (≥60%)' },
                  { id: 'minhas', rotulo: 'Adicionadas' },
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
                        backgroundColor: ativa
                          ? cores.destaque
                          : cores.superficie,
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

            {/* Card de Simular Nova Vaga */}
            <Card style={styles.formCard}>
              <View style={styles.formToggleRow}>
                <View style={{ flex: 1, marginRight: spacing.sm }}>
                  <Text style={[tipografia.textoDestaque, { color: cores.tinta }]}>
                    Simular outra oportunidade
                  </Text>
                  <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                    Cole a descrição de uma vaga para extrair seus requisitos.
                  </Text>
                </View>

                <Button
                  titulo={formAberto ? 'Fechar' : 'Colar vaga  ↗'}
                  onPress={() => setFormAberto(!formAberto)}
                  variante={formAberto ? 'padrao' : 'primario'}
                  compacto
                />
              </View>

              {formAberto ? (
                <View style={[styles.formBody, { borderTopColor: cores.linha }]}>
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
                    rotulo="DESCRIÇÃO E REQUISITOS DA VAGA"
                    placeholder="Cole os requisitos obrigatórios e diferenciais..."
                    multiline
                    value={novaDescricao}
                    onChangeText={setNovaDescricao}
                    inputStyle={{ minHeight: 110 }}
                    erro={erroForm || undefined}
                  />

                  <Button
                    titulo="Aplicar e Diagnosticar  ↗"
                    onPress={handleAdicionarVaga}
                    variante="primario"
                    carregando={adicionando}
                  />
                </View>
              ) : null}
            </Card>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            titulo="Nenhuma vaga encontrada"
            mensagem="Experimente alterar o filtro acima ou colar uma nova oportunidade."
            acaoTitulo="Ver todas as vagas"
            onAcao={() => {
              setBusca('');
              setAbaFiltro('todas');
            }}
          />
        }
        renderItem={({ item }) => {
          const { vaga, aderencia, diagnostico } = item;

          return (
            <View
              style={[
                styles.bentoJobOuter,
                { backgroundColor: cores.superficie, borderColor: cores.linha },
              ]}
            >
              {/* Card Interno Estilo "Vaga / Oferta" do Roadmap CREA-MA */}
              <View
                style={[
                  styles.bentoJobInner,
                  { backgroundColor: cores.superficie, borderColor: cores.linha },
                ]}
              >
                <View style={styles.innerTopRow}>
                  <Text style={[styles.vagaTagLabel, { color: cores.textoSecundario }]}>
                    {vaga.origem === 'exemplo'
                      ? 'Vaga de Exemplo'
                      : vaga.origem === 'aluno'
                      ? 'Sua Vaga Simulada'
                      : 'Vaga de Empresa'}
                  </Text>
                  <Badge
                    rotulo={aderencia !== null ? `${aderencia}% compatível` : 'Sem req.'}
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

                <Text style={[styles.jobBigTitle, { color: cores.tinta }]}>
                  {vaga.titulo}
                </Text>

                <View
                  style={[
                    styles.companyPillRow,
                    { backgroundColor: cores.superficieSecundaria, borderColor: cores.linha },
                  ]}
                >
                  <Text style={{ fontSize: 13, marginRight: 6 }}>🏢</Text>
                  <Text style={[styles.companyNameText, { color: cores.tinta }]} numberOfLines={1}>
                    {vaga.empresa}
                  </Text>
                  <Text style={[styles.reqCountText, { color: cores.textoSecundario }]}>
                    {diagnostico.requisitosAtendidosCount}/{diagnostico.totalRequisitos} req.
                  </Text>
                </View>

                <ProgressBar
                  progresso={aderencia ?? 0}
                  cor={cores.destaque}
                  altura={6}
                  style={{ marginTop: 10 }}
                />

                <View style={styles.innerActionsRow}>
                  {vaga.origem !== 'exemplo' ? (
                    <Pressable
                      onPress={() => confirmarRemocao(vaga.id, vaga.titulo)}
                      style={styles.removeBtn}
                    >
                      <Text style={[tipografia.textoDestaque, { color: cores.erro, fontSize: 12.5 }]}>
                        Remover
                      </Text>
                    </Pressable>
                  ) : (
                    <View />
                  )}

                  <Button
                    titulo="Analisar vaga  ↗"
                    onPress={async () => {
                      await selecionarVaga(vaga.id);
                      onNavegarParaDiagnostico(vaga.id);
                    }}
                    variante="primario"
                    compacto
                  />
                </View>
              </View>
            </View>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: spacing.xs,
  },
  centeredHeader: {
    alignItems: 'center',
    marginBottom: spacing.md,
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: spacing.md,
  },
  searchInputWrap: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    minHeight: 42,
    justifyContent: 'center',
  },
  searchInput: {
    fontFamily: fontNames.plexSans400,
    fontSize: 13.5,
  },
  blackSearchCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillFilterRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: spacing.md,
  },
  filterPill: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterPillText: {
    fontSize: 12,
  },
  formCard: {
    padding: spacing.md,
  },
  formToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formBody: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
  },
  bentoJobOuter: {
    borderRadius: 18,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  bentoJobInner: {
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.md,
    shadowColor: '#0A0D14',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  innerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vagaTagLabel: {
    fontFamily: fontNames.plexSans500,
    fontSize: 11.5,
  },
  jobBigTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    marginTop: 6,
  },
  companyPillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  companyNameText: {
    fontFamily: fontNames.plexSans500,
    fontSize: 12.5,
    flex: 1,
  },
  reqCountText: {
    fontFamily: fontNames.plexMono600,
    fontSize: 11.5,
    fontWeight: '600',
  },
  innerActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  removeBtn: {
    paddingVertical: 6,
    paddingRight: 8,
  },
});

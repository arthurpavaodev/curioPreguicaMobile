import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Botao, CampoDeTexto, Cartao, Selo } from '../../components';
import { useVagas } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

interface VagasAlunoScreenProps {
  onNavegarParaDiagnostico: (vagaId: string) => void;
}

export function VagasAlunoScreen({ onNavegarParaDiagnostico }: VagasAlunoScreenProps) {
  const { cores } = useTheme();
  const { vagas, carregando, erro, adicionarVaga, removerVaga } = useVagas('aluno');

  const [formAberto, setFormAberto] = useState(false);
  const [novoTitulo, setNovoTitulo] = useState('');
  const [novaEmpresa, setNovaEmpresa] = useState('');
  const [novaDescricao, setNovaDescricao] = useState('');
  const [erroForm, setErroForm] = useState<string | null>(null);
  const [adicionando, setAdicionando] = useState(false);

  const handleAdicionarVaga = async () => {
    setErroForm(null);
    if (novoTitulo.trim().length < 3 || novaDescricao.trim().length < 10) {
      setErroForm('Informe o título e a descrição da vaga (mínimo 10 caracteres na descrição).');
      return;
    }

    try {
      setAdicionando(true);
      await adicionarVaga(
        novoTitulo.trim(),
        novaEmpresa.trim() || undefined,
        novaDescricao.trim(),
        'aluno',
      );
      setNovoTitulo('');
      setNovaEmpresa('');
      setNovaDescricao('');
      setFormAberto(false);
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
        keyExtractor={(item) => item.vaga.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
              Vagas Disponíveis
            </Text>
            <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
              Compare seu currículo com vagas de exemplo ou adicione outras oportunidades.
            </Text>

            {/* Botão de abrir/fechar formulário de nova vaga */}
            <Cartao style={styles.formCard}>
              <Pressable
                onPress={() => setFormAberto(!formAberto)}
                style={styles.toggleFormHeader}
                accessibilityRole="button"
                accessibilityLabel={formAberto ? 'Fechar formulário de nova vaga' : 'Colar outra vaga'}
              >
                <Text style={[tipografia.textoDestaque, { color: cores.destaque }]}>
                  {formAberto ? '▲ Fechar formulário' : '+ Colar outra vaga'}
                </Text>
              </Pressable>

              {formAberto ? (
                <View style={styles.formBody}>
                  <CampoDeTexto
                    rotulo="TÍTULO DA VAGA"
                    placeholder="Ex: Estágio em Desenvolvimento Web"
                    value={novoTitulo}
                    onChangeText={setNovoTitulo}
                  />

                  <CampoDeTexto
                    rotulo="EMPRESA (OPCIONAL)"
                    placeholder="Ex: Empresa de Tecnologia"
                    value={novaEmpresa}
                    onChangeText={setNovaEmpresa}
                  />

                  <CampoDeTexto
                    rotulo="DESCRIÇÃO / REQUISITOS DA VAGA"
                    placeholder="Cole a descrição completa da vaga com os requisitos..."
                    multiline
                    value={novaDescricao}
                    onChangeText={setNovaDescricao}
                    inputStyle={{ minHeight: 120 }}
                    erro={erroForm || undefined}
                  />

                  <Botao
                    titulo="Adicionar vaga"
                    onPress={handleAdicionarVaga}
                    variante="primario"
                    carregando={adicionando}
                  />
                </View>
              ) : null}
            </Cartao>

            {erro ? (
              <Text style={[tipografia.apoio, { color: cores.erro, marginBottom: 8 }]}>
                {erro}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }) => {
          const { vaga, aderencia } = item;
          let aderenciaVariante: 'ok' | 'atencao' | 'erro' | 'padrao' = 'padrao';
          let aderenciaRotulo = 'Sem requisitos';

          if (aderencia !== null) {
            aderenciaRotulo = `${aderencia}% aderência`;
            if (aderencia >= 75) aderenciaVariante = 'ok';
            else if (aderencia >= 45) aderenciaVariante = 'atencao';
            else aderenciaVariante = 'erro';
          }

          return (
            <Cartao>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={[tipografia.secao, { color: cores.tinta }]}>
                    {vaga.titulo}
                  </Text>
                  <Text
                    style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}
                  >
                    {vaga.empresa}
                  </Text>
                </View>

                {vaga.origem === 'exemplo' ? (
                  <Selo rotulo="exemplo" variante="padrao" />
                ) : vaga.origem === 'aluno' ? (
                  <Selo rotulo="sua vaga" variante="destaque" />
                ) : (
                  <Selo rotulo="empresa" variante="ok" />
                )}
              </View>

              <View style={styles.aderenciaRow}>
                <Text style={[tipografia.rotulo, { color: cores.textoSecundario }]}>
                  COMPATIBILIDADE:
                </Text>
                <Selo rotulo={aderenciaRotulo} variante={aderenciaVariante} />
              </View>

              <View style={styles.cardActions}>
                <Botao
                  titulo="Analisar"
                  onPress={() => onNavegarParaDiagnostico(vaga.id)}
                  variante="primario"
                  style={styles.actionBtn}
                />

                {vaga.origem !== 'exemplo' ? (
                  <Botao
                    titulo="Remover"
                    onPress={() => confirmarRemocao(vaga.id, vaga.titulo)}
                    variante="fantasma"
                    style={styles.actionBtn}
                  />
                ) : null}
              </View>
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
  formCard: {
    marginBottom: 16,
  },
  toggleFormHeader: {
    paddingVertical: 4,
    alignItems: 'center',
  },
  formBody: {
    marginTop: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  aderenciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
  },
});

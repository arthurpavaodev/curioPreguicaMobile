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
import { useEmpresa } from '../../hooks';
import { useTheme } from '../../theme/ThemeContext';
import { tipografia } from '../../theme/typography';

interface VagasEmpresaScreenProps {
  onVerCandidatosVaga: (vagaId: string) => void;
}

export function VagasEmpresaScreen({ onVerCandidatosVaga }: VagasEmpresaScreenProps) {
  const { cores } = useTheme();
  const { vagasEmpresa, carregando, erro, criarVaga, removerVaga } = useEmpresa(null);

  const [formAberto, setFormAberto] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [descricao, setDescricao] = useState('');
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
      await criarVaga(
        titulo.trim(),
        empresa.trim() || 'Minha Empresa',
        descricao.trim(),
      );
      setTitulo('');
      setEmpresa('');
      setDescricao('');
      setFormAberto(false);
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

  if (carregando && vagasEmpresa.length === 0) {
    return (
      <View style={[styles.centralizado, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <FlatList
        data={vagasEmpresa}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[tipografia.tituloTela, { color: cores.tinta, marginBottom: 4 }]}>
              Minhas Vagas
            </Text>
            <Text style={[tipografia.texto, { color: cores.textoSecundario, marginBottom: 14 }]}>
              Publique novas vagas e veja quais alunos atendem aos requisitos.
            </Text>

            {/* Formulário Nova Vaga */}
            <Cartao style={styles.formCard}>
              <Pressable
                onPress={() => setFormAberto(!formAberto)}
                style={styles.toggleFormHeader}
                accessibilityRole="button"
                accessibilityLabel={formAberto ? 'Fechar formulário de nova vaga' : 'Nova vaga'}
              >
                <Text style={[tipografia.textoDestaque, { color: cores.destaque }]}>
                  {formAberto ? '▲ Fechar formulário' : '+ Nova vaga'}
                </Text>
              </Pressable>

              {formAberto ? (
                <View style={styles.formBody}>
                  <CampoDeTexto
                    rotulo="TÍTULO DA VAGA"
                    placeholder="Ex: Desenvolvedor Mobile Júnior"
                    value={titulo}
                    onChangeText={setTitulo}
                  />

                  <CampoDeTexto
                    rotulo="NOME DA EMPRESA"
                    placeholder="Ex: Minha Empresa Tech"
                    value={empresa}
                    onChangeText={setEmpresa}
                  />

                  <CampoDeTexto
                    rotulo="DESCRIÇÃO E REQUISITOS"
                    placeholder="Descreva a vaga e liste os requisitos (obrigatórios e diferenciais)..."
                    multiline
                    value={descricao}
                    onChangeText={setDescricao}
                    inputStyle={{ minHeight: 120 }}
                    erro={erroForm || undefined}
                  />

                  <Botao
                    titulo="Publicar vaga"
                    onPress={handleCadastrarVaga}
                    variante="primario"
                    carregando={cadastrando}
                  />
                </View>
              ) : null}
            </Cartao>

            <View style={styles.secaoTituloRow}>
              <Text style={[tipografia.secao, { color: cores.tinta }]}>
                Vagas Publicadas
              </Text>
              <Text style={[tipografia.apoio, { color: cores.textoSecundario }]}>
                {vagasEmpresa.length} {vagasEmpresa.length === 1 ? 'vaga' : 'vagas'}
              </Text>
            </View>
          </View>
        }
        renderItem={({ item }) => (
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
                <Selo rotulo="sua empresa" variante="ok" />
              )}
            </View>

            <View style={styles.cardActions}>
              <Botao
                titulo="Candidatos"
                onPress={() => onVerCandidatosVaga(item.id)}
                variante="primario"
                style={styles.actionBtn}
              />

              {item.origem !== 'exemplo' ? (
                <Botao
                  titulo="Remover"
                  onPress={() => confirmarRemocao(item.id, item.titulo)}
                  variante="fantasma"
                  style={styles.actionBtn}
                />
              ) : null}
            </View>
          </Cartao>
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
  secaoTituloRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
  },
});

import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Vaga } from '../../../../domain';
import { useTheme } from '../theme/ThemeContext';
import { tipografia } from '../theme/typography';
import { Selo } from './Selo';

export interface SeletorDeVagaProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
}

export function SeletorDeVaga({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
}: SeletorDeVagaProps) {
  const { cores } = useTheme();
  const [modalVisivel, setModalVisivel] = useState(false);

  const vagaAtual =
    vagas.find((v) => v.id === vagaSelecionadaId) || vagas[0] || null;

  return (
    <View style={styles.container}>
      <Text style={[tipografia.rotulo, { color: cores.textoSecundario, marginBottom: 6 }]}>
        VAGA SELECIONADA
      </Text>

      <Pressable
        onPress={() => setModalVisivel(true)}
        accessibilityRole="button"
        accessibilityLabel={`Vaga selecionada: ${vagaAtual ? vagaAtual.titulo : 'Nenhuma'}. Toque para trocar.`}
        style={[
          styles.seletorBotao,
          {
            backgroundColor: cores.superficie,
            borderColor: cores.linha,
          },
        ]}
      >
        <View style={styles.infoContainer}>
          <Text
            numberOfLines={1}
            style={[tipografia.textoDestaque, { color: cores.tinta, fontSize: 15 }]}
          >
            {vagaAtual ? vagaAtual.titulo : 'Selecione uma vaga'}
          </Text>
          {vagaAtual ? (
            <Text
              numberOfLines={1}
              style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 2 }]}
            >
              {vagaAtual.empresa}
            </Text>
          ) : null}
        </View>

        <View style={styles.trocarPill}>
          <Text style={[tipografia.rotulo, { color: cores.destaque }]}>TROCAR</Text>
        </View>
      </Pressable>

      <Modal
        visible={modalVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisivel(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisivel(false)}
        >
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: cores.superficie,
                borderColor: cores.linha,
              },
            ]}
          >
            <Text
              style={[
                tipografia.secao,
                { color: cores.tinta, marginBottom: 12 },
              ]}
            >
              Selecione uma vaga
            </Text>

            <FlatList
              data={vagas}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => (
                <View style={[styles.separador, { backgroundColor: cores.linha }]} />
              )}
              renderItem={({ item }) => {
                const isSelected = item.id === vagaAtual?.id;
                return (
                  <Pressable
                    onPress={() => {
                      onSelecionarVaga(item.id);
                      setModalVisivel(false);
                    }}
                    style={[
                      styles.opcaoItem,
                      isSelected && {
                        backgroundColor: cores.destaqueSuave,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          tipografia.textoDestaque,
                          {
                            color: isSelected ? cores.destaque : cores.tinta,
                          },
                        ]}
                      >
                        {item.titulo}
                      </Text>
                      <Text
                        style={[
                          tipografia.apoio,
                          { color: cores.textoSecundario, marginTop: 2 },
                        ]}
                      >
                        {item.empresa}
                      </Text>
                    </View>

                    {item.origem === 'exemplo' ? (
                      <Selo rotulo="exemplo" variante="padrao" />
                    ) : item.origem === 'aluno' ? (
                      <Selo rotulo="sua vaga" variante="destaque" />
                    ) : (
                      <Selo rotulo="empresa" variante="ok" />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
  },
  seletorBotao: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoContainer: {
    flex: 1,
    marginRight: 10,
  },
  trocarPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    maxHeight: '75%',
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
  },
  opcaoItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  separador: {
    height: 1,
  },
});

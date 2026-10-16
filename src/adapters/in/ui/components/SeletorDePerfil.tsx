import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PerfilUsuario } from '../../../../application';
import { useTheme } from '../theme/ThemeContext';
import { tipografia } from '../theme/typography';

export interface SeletorDePerfilProps {
  perfilAtual: PerfilUsuario;
  onSelecionarPerfil: (perfil: PerfilUsuario) => void;
}

const PERFIS: { id: PerfilUsuario; rotulo: string }[] = [
  { id: 'aluno', rotulo: 'Aluno' },
  { id: 'teia', rotulo: 'TEIA' },
  { id: 'empresa', rotulo: 'Empresa' },
];

export function SeletorDePerfil({
  perfilAtual,
  onSelecionarPerfil,
}: SeletorDePerfilProps) {
  const { cores } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cores.superficie,
          borderColor: cores.linha,
        },
      ]}
      accessibilityRole="tablist"
      accessibilityLabel="Seletor de perfil de usuário"
    >
      {PERFIS.map((p) => {
        const ativo = perfilAtual === p.id;
        return (
          <Pressable
            key={p.id}
            onPress={() => onSelecionarPerfil(p.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativo }}
            accessibilityLabel={`Perfil ${p.rotulo}`}
            style={[
              styles.item,
              {
                backgroundColor: ativo ? cores.destaque : 'transparent',
              },
            ]}
          >
            <Text
              style={[
                tipografia.textoDestaque,
                {
                  color: ativo ? cores.destaqueTexto : cores.textoSecundario,
                  fontSize: 14,
                },
              ]}
            >
              {p.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    padding: 4,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  item: {
    flex: 1,
    minHeight: 38,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
});

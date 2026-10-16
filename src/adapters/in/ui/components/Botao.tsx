import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { tipografia } from '../theme/typography';

export type VarianteBotao = 'primario' | 'padrao' | 'fantasma';

export interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: VarianteBotao;
  desabilitado?: boolean;
  carregando?: boolean;
  style?: ViewStyle;
  testID?: string;
  accessibilityLabel?: string;
}

export function Botao({
  titulo,
  onPress,
  variante = 'padrao',
  desabilitado = false,
  carregando = false,
  style,
  testID,
  accessibilityLabel,
}: BotaoProps) {
  const { cores } = useTheme();

  let fundo = cores.linha;
  let textoCor = cores.tinta;
  let bordaCor = 'transparent';

  switch (variante) {
    case 'primario':
      fundo = cores.destaque;
      textoCor = cores.destaqueTexto;
      break;
    case 'padrao':
      fundo = cores.linha;
      textoCor = cores.tinta;
      break;
    case 'fantasma':
      fundo = 'transparent';
      textoCor = cores.destaque;
      bordaCor = cores.destaque;
      break;
  }

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={desabilitado || carregando}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || titulo}
      accessibilityState={{ disabled: desabilitado || carregando }}
      style={({ pressed }) => [
        styles.botao,
        {
          backgroundColor: fundo,
          borderColor: bordaCor,
          borderWidth: variante === 'fantasma' ? 1 : 0,
          opacity: desabilitado ? 0.5 : pressed ? 0.8 : 1,
        },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={textoCor} size="small" />
      ) : (
        <Text style={[tipografia.textoDestaque, { color: textoCor }]}>
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

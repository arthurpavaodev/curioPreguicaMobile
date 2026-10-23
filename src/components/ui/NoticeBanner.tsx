import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../../app/providers/ThemeProvider';
import { radius, spacing, tipografia } from '../../theme';

export interface NoticeBannerProps {
  mensagem: string;
  titulo?: string;
  tipo?: 'info' | 'atencao' | 'ok' | 'erro';
  style?: StyleProp<ViewStyle>;
}

export function NoticeBanner({
  mensagem,
  titulo,
  tipo = 'info',
  style,
}: NoticeBannerProps) {
  const { cores } = useTheme();

  const getPalette = () => {
    switch (tipo) {
      case 'atencao':
        return {
          bg: cores.atencaoSuave,
          border: cores.atencao,
          accent: cores.atencao,
          icon: '!',
        };
      case 'ok':
        return {
          bg: cores.okSuave,
          border: cores.ok,
          accent: cores.ok,
          icon: '✓',
        };
      case 'erro':
        return {
          bg: cores.erroSuave,
          border: cores.erro,
          accent: cores.erro,
          icon: '!',
        };
      default:
        return {
          bg: cores.destaqueSuave,
          border: cores.isDark ? '#2563EB' : '#B2DDFF',
          accent: cores.destaque,
          icon: 'i',
        };
    }
  };

  const { bg, border, accent, icon } = getPalette();

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: bg,
          borderColor: border,
        },
        style,
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: accent }]}>
        <Text style={styles.iconText}>{icon}</Text>
      </View>

      <View style={styles.textWrap}>
        {titulo ? (
          <Text style={[tipografia.textoDestaque, { color: cores.tinta, fontSize: 13 }]}>
            {titulo}
          </Text>
        ) : null}
        <Text style={[tipografia.apoio, { color: cores.tinta, marginTop: titulo ? 1 : 0 }]}>
          {mensagem}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  textWrap: {
    flex: 1,
  },
});

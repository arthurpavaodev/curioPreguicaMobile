import { TextStyle } from 'react-native';

export const fontNames = {
  bricolage600: 'BricolageGrotesque_600SemiBold',
  bricolage700: 'BricolageGrotesque_700Bold',
  plexSans400: 'IBMPlexSans_400Regular',
  plexSans500: 'IBMPlexSans_500Medium',
  plexSans600: 'IBMPlexSans_600SemiBold',
  plexMono400: 'IBMPlexMono_400Regular',
  plexMono600: 'IBMPlexMono_600SemiBold',
};

export const tipografia: Record<string, TextStyle> = {
  tituloTela: {
    fontFamily: fontNames.bricolage700,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  secao: {
    fontFamily: fontNames.bricolage600,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  subtitulo: {
    fontFamily: fontNames.plexSans600,
    fontSize: 15.5,
    lineHeight: 22,
    fontWeight: '600',
  },
  texto: {
    fontFamily: fontNames.plexSans400,
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '400',
  },
  textoMedio: {
    fontFamily: fontNames.plexSans500,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
  textoDestaque: {
    fontFamily: fontNames.plexSans600,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  apoio: {
    fontFamily: fontNames.plexSans400,
    fontSize: 12.5,
    lineHeight: 18,
    fontWeight: '400',
  },
  rotulo: {
    fontFamily: fontNames.plexSans600,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  monoValor: {
    fontFamily: fontNames.bricolage700,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
  },
  monoDestaque: {
    fontFamily: fontNames.bricolage700,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '700',
  },
};

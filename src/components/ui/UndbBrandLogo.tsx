import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { fontNames, radius, spacing } from '../../theme';

export interface UndbBrandLogoProps {
  comAviao?: boolean;
  tamanho?: 'pequeno' | 'medio' | 'grande';
  mostrarSubtitulo?: boolean;
}

export function UndbBrandLogo({
  comAviao = true,
  tamanho = 'medio',
  mostrarSubtitulo = true,
}: UndbBrandLogoProps) {
  const escala = tamanho === 'pequeno' ? 0.7 : tamanho === 'grande' ? 1.25 : 1.0;

  // Animação de subida e flutuação do avião decolando
  const animSubida = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animSubida, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(animSubida, {
          toValue: 0,
          duration: 1800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animSubida]);

  const translateY = animSubida.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const translateX = animSubida.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  return (
    <View style={[styles.container, { transform: [{ scale: escala }] }]}>
      {/* 1. AVIÃO DECOLANDO ESTILIZADO */}
      {comAviao && (
        <View style={styles.airplaneWrapper}>
          {/* Linha da trajetória de decolagem */}
          <View style={styles.takeoffTrailContainer}>
            <View style={styles.trailLine1} />
            <View style={styles.trailLine2} />
            <View style={styles.trailLine3} />
          </View>

          {/* O Avião inclinado 45 graus para cima e para a direita */}
          <Animated.View
            style={[
              styles.airplaneCircle,
              {
                transform: [
                  { translateX },
                  { translateY },
                  { rotate: '-35deg' },
                ],
              },
            ]}
          >
            <Text style={styles.airplaneSymbol}>✈</Text>
          </Animated.View>
        </View>
      )}

      {/* 2. TÍTULO DO PROJETO */}
      <View style={styles.titleWrapper}>
        <Text style={styles.titleText}>Plano de Voo</Text>
        <Text style={styles.titleSub}>Programa de Aderência Profissional</Text>
      </View>

      {/* 3. LOGO DA UNIVERSIDADE UNDB */}
      <View style={styles.undbContainer}>
        {/* Ícone Squircle Gradiente */}
        <View style={styles.squircle}>
          <View style={styles.grid2x2}>
            {/* Topo Esquerda: U */}
            <View style={styles.whiteBox}>
              <Text style={styles.undbLetter}>U</Text>
            </View>
            {/* Topo Direita: N */}
            <View style={styles.whiteBox}>
              <Text style={styles.undbLetter}>N</Text>
            </View>
            {/* Base Esquerda: D */}
            <View style={styles.whiteBox}>
              <Text style={styles.undbLetter}>D</Text>
            </View>
            {/* Base Direita: B */}
            <View style={styles.whiteBox}>
              <Text style={styles.undbLetter}>B</Text>
            </View>
          </View>
        </View>

        {/* Nome da Universidade */}
        <Text style={styles.undbWord}>UNDB</Text>
        {mostrarSubtitulo && (
          <Text style={styles.undbSubtitle}>CENTRO UNIVERSITÁRIO</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  airplaneWrapper: {
    width: 110,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  takeoffTrailContainer: {
    position: 'absolute',
    bottom: 12,
    left: 8,
    width: 60,
    height: 35,
    transform: [{ rotate: '-28deg' }],
    justifyContent: 'space-between',
  },
  trailLine1: {
    height: 2.5,
    width: 32,
    backgroundColor: '#0057FF',
    borderRadius: 2,
    opacity: 0.35,
  },
  trailLine2: {
    height: 2.5,
    width: 48,
    backgroundColor: '#0057FF',
    borderRadius: 2,
    opacity: 0.6,
  },
  trailLine3: {
    height: 3,
    width: 62,
    backgroundColor: '#0057FF',
    borderRadius: 2,
    opacity: 0.9,
  },
  airplaneCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#0057FF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0057FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  airplaneSymbol: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  titleWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.xs,
  },
  titleText: {
    fontFamily: fontNames.bricolage700,
    fontSize: 28,
    fontWeight: '700',
    color: '#0A0D14',
    letterSpacing: -0.5,
  },
  titleSub: {
    fontFamily: fontNames.plexSans400,
    fontSize: 13,
    color: '#667085',
    marginTop: 2,
  },
  undbContainer: {
    alignItems: 'center',
  },
  squircle: {
    width: 74,
    height: 74,
    borderRadius: 18,
    backgroundColor: '#D91A5B', // Base magenta/vermelha da UNDB
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D91A5B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  grid2x2: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  whiteBox: {
    width: '46.5%',
    height: '46.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  undbLetter: {
    fontFamily: fontNames.bricolage700,
    fontSize: 17,
    fontWeight: '800',
    color: '#D91A5B',
  },
  undbWord: {
    fontFamily: fontNames.bricolage700,
    fontSize: 22,
    fontWeight: '800',
    color: '#0A0D14',
    letterSpacing: 1.5,
    marginTop: 10,
  },
  undbSubtitle: {
    fontFamily: fontNames.plexSans600,
    fontSize: 9.5,
    letterSpacing: 1.8,
    fontWeight: '700',
    color: '#667085',
    marginTop: 2,
  },
});

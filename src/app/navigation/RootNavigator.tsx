import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFonts,
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_600SemiBold,
} from '@expo-google-fonts/ibm-plex-mono';
import { UndbBrandLogo } from '../../components';
import { LoginScreen } from '../../features/auth/screens/LoginScreen';
import { fontNames, radius, spacing } from '../../theme';
import { useAppData } from '../providers/AppDataProvider';
import { useTheme } from '../providers/ThemeProvider';
import { TabNavigator } from './TabNavigator';

const ROTULO_PERFIL: Record<'aluno' | 'teia' | 'empresa', { nome: string; icone: string }> = {
  aluno: { nome: 'Estudante', icone: '🎓' },
  empresa: { nome: 'Empresa', icone: '🏢' },
  teia: { nome: 'Coord. TEIA', icone: '⚡' },
};

export function RootNavigator() {
  const { cores, isDark, alternarTema } = useTheme();
  const { autenticado, perfil, carregando, sair } = useAppData();

  const [fontsLoaded] = useFonts({
    [fontNames.bricolage600]: BricolageGrotesque_600SemiBold,
    [fontNames.bricolage700]: BricolageGrotesque_700Bold,
    [fontNames.plexSans400]: IBMPlexSans_400Regular,
    [fontNames.plexSans500]: IBMPlexSans_500Medium,
    [fontNames.plexSans600]: IBMPlexSans_600SemiBold,
    [fontNames.plexMono400]: IBMPlexMono_400Regular,
    [fontNames.plexMono600]: IBMPlexMono_600SemiBold,
  });

  if (!fontsLoaded || carregando) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: cores.superficie }]}>
        <UndbBrandLogo comAviao={true} tamanho="grande" mostrarSubtitulo={true} />
        <View style={{ marginTop: 28, alignItems: 'center' }}>
          <ActivityIndicator size="small" color={cores.destaque} />
          <Text style={[styles.loadingHintText, { color: cores.textoSecundario }]}>
            Preparando seu plano de voo...
          </Text>
        </View>
      </View>
    );
  }

  if (!autenticado) {
    return (
      <SafeAreaView
        edges={['top', 'left', 'right', 'bottom']}
        style={[styles.safeArea, { backgroundColor: cores.fundo }]}
      >
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <LoginScreen />
      </SafeAreaView>
    );
  }

  const infoPerfil = ROTULO_PERFIL[perfil];

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: cores.superficie }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header enxuto mostrando apenas a marca, o perfil ativo e botão de trocar perfil/sair */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: cores.superficie,
            borderBottomColor: cores.linha,
          },
        ]}
      >
        <View style={styles.brandRow}>
          <View style={styles.emblemGroup}>
            <View
              style={[
                styles.emblemCircle,
                {
                  borderColor: '#D91A5B',
                  backgroundColor: '#FFEBF1',
                },
              ]}
            >
              <Text style={styles.emblemIcon}>✈</Text>
            </View>
            <View>
              <Text style={[styles.brandTitle, { color: cores.tinta }]} numberOfLines={1}>
                Plano de Voo
              </Text>
              <Text style={[styles.profileSubtitle, { color: cores.destaque }]} numberOfLines={1}>
                {infoPerfil.icone} {infoPerfil.nome}
              </Text>
            </View>
          </View>

          <View style={styles.headerActions}>
            <Pressable
              onPress={alternarTema}
              accessibilityRole="button"
              accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
              style={[
                styles.iconPillBtn,
                { backgroundColor: cores.superficieSecundaria },
              ]}
            >
              <Text style={[styles.pillBtnText, { color: cores.tinta }]}>
                {isDark ? '☀' : '☾'}
              </Text>
            </Pressable>

            <Pressable
              onPress={sair}
              accessibilityRole="button"
              accessibilityLabel="Sair ou trocar perfil"
              style={[
                styles.logoutPillBtn,
                {
                  backgroundColor: cores.superficieSecundaria,
                  borderColor: cores.linha,
                },
              ]}
            >
              <Text style={[styles.pillBtnText, { color: cores.tinta }]}>
                Trocar perfil
              </Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Corpo Principal separado por perfil */}
      <View style={[styles.mainBody, { backgroundColor: cores.fundo }]}>
        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainBody: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  loadingHintText: {
    fontFamily: fontNames.plexSans500,
    fontSize: 13,
    marginTop: 10,
    letterSpacing: 0.2,
  },
  header: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emblemGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  emblemCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemIcon: {
    color: '#D91A5B',
    fontSize: 13,
    fontWeight: '700',
  },
  brandTitle: {
    fontFamily: fontNames.bricolage700,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: '700',
  },
  profileSubtitle: {
    fontFamily: fontNames.plexSans600,
    fontSize: 11.5,
    lineHeight: 15,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconPillBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutPillBtn: {
    paddingHorizontal: 12,
    height: 32,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtnText: {
    fontFamily: fontNames.plexSans600,
    fontSize: 12,
    fontWeight: '600',
  },
});

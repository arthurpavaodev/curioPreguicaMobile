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
import { ProfileSelector, UndbBrandLogo } from '../../components';
import { fontNames, radius, spacing, tipografia } from '../../theme';
import { useAppData } from '../providers/AppDataProvider';
import { useTheme } from '../providers/ThemeProvider';
import { TabNavigator } from './TabNavigator';

export function RootNavigator() {
  const { cores, isDark, alternarTema } = useTheme();
  const { perfil, carregando, selecionarPerfil } = useAppData();

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

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: cores.superficie }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header Limpo Estilo "Banco de oportunidades do CREA-MA" */}
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
              <Text style={[styles.emblemIcon, { color: '#D91A5B', fontSize: 13 }]}>✈</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.brandLine1, { color: cores.textoSecundario }]} numberOfLines={1}>
                Banco de oportunidades do
              </Text>
              <Text style={[styles.brandLine2, { color: cores.tinta }]} numberOfLines={1}>
                PLANO DE VOO · <Text style={{ color: cores.destaque }}>TEIA-UNDB</Text>
              </Text>
            </View>
          </View>

          <Pressable
            onPress={alternarTema}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
            style={[
              styles.loginPillBtn,
              { backgroundColor: cores.superficieSecundaria },
            ]}
          >
            <Text style={[styles.loginPillText, { color: cores.tinta }]}>
              {isDark ? '☀ Claro' : '☾ Escuro'}
            </Text>
          </Pressable>
        </View>

        <ProfileSelector
          perfilAtual={perfil}
          onSelecionarPerfil={selecionarPerfil}
        />
      </View>

      {/* Corpo Principal */}
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
    paddingTop: spacing.xs,
    borderBottomWidth: 1,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  emblemGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginRight: spacing.sm,
  },
  emblemCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emblemIcon: {
    fontSize: 15,
    fontWeight: '700',
  },
  brandLine1: {
    fontFamily: fontNames.plexSans400,
    fontSize: 11,
    lineHeight: 14,
  },
  brandLine2: {
    fontFamily: fontNames.bricolage700,
    fontSize: 13.5,
    lineHeight: 17,
    fontWeight: '700',
  },
  loginPillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  loginPillText: {
    fontFamily: fontNames.plexSans600,
    fontSize: 11.5,
    fontWeight: '600',
  },
});

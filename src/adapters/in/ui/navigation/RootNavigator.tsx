import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
import { Vaga } from '../../../../domain';
import { useContainer } from '../../../../main';
import { SeletorDePerfil } from '../components/SeletorDePerfil';
import { usePreferencias } from '../hooks/usePreferencias';
import { useTheme } from '../theme/ThemeContext';
import { fontNames, tipografia } from '../theme/typography';
import { AlunoNavigator } from './AlunoNavigator';
import { TeiaNavigator } from './TeiaNavigator';
import { EmpresaNavigator } from './EmpresaNavigator';

export function RootNavigator() {
  const { cores, isDark } = useTheme();
  const container = useContainer();

  const [fontsLoaded] = useFonts({
    [fontNames.bricolage600]: BricolageGrotesque_600SemiBold,
    [fontNames.bricolage700]: BricolageGrotesque_700Bold,
    [fontNames.plexSans400]: IBMPlexSans_400Regular,
    [fontNames.plexSans500]: IBMPlexSans_500Medium,
    [fontNames.plexSans600]: IBMPlexSans_600SemiBold,
    [fontNames.plexMono400]: IBMPlexMono_400Regular,
    [fontNames.plexMono600]: IBMPlexMono_600SemiBold,
  });

  const {
    perfil,
    vagaSelecionadaId,
    carregando: prefsCarregando,
    selecionarPerfil,
    selecionarVaga,
  } = usePreferencias();

  const [todasVagas, setTodasVagas] = useState<Vaga[]>([]);
  const [carregandoVagas, setCarregandoVagas] = useState(true);

  useEffect(() => {
    async function carregarTodasVagas() {
      try {
        const lista = await container.listarVagas.execute({ perfil: 'aluno' });
        setTodasVagas(lista);
      } finally {
        setCarregandoVagas(false);
      }
    }
    carregarTodasVagas();
  }, [container]);

  if (!fontsLoaded || prefsCarregando || carregandoVagas) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: cores.fundo }]}>
        <ActivityIndicator size="large" color={cores.destaque} />
        <Text style={[tipografia.apoio, { color: cores.textoSecundario, marginTop: 12 }]}>
          Carregando Plano de Voo...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.safeArea, { backgroundColor: cores.fundo }]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={cores.fundo}
      />

      {/* Top Header com Identidade Visual */}
      <View style={styles.topHeader}>
        <View style={styles.brandContainer}>
          <Text style={[tipografia.rotulo, { color: cores.destaque, fontSize: 12 }]}>
            PLANO DE VOO
          </Text>
          <Text style={[tipografia.apoio, { color: cores.textoSecundario, fontSize: 11 }]}>
            Assistente de Empregabilidade · UNDB
          </Text>
        </View>

        {/* Seletor de Perfil sempre visível no topo */}
        <SeletorDePerfil
          perfilAtual={perfil}
          onSelecionarPerfil={selecionarPerfil}
        />
      </View>

      {/* Navegação por abas do perfil ativo */}
      <NavigationContainer>
        {perfil === 'aluno' && (
          <AlunoNavigator
            vagas={todasVagas}
            vagaSelecionadaId={vagaSelecionadaId}
            onSelecionarVaga={selecionarVaga}
          />
        )}

        {perfil === 'teia' && (
          <TeiaNavigator
            vagas={todasVagas}
            vagaSelecionadaId={vagaSelecionadaId}
            onSelecionarVaga={selecionarVaga}
          />
        )}

        {perfil === 'empresa' && (
          <EmpresaNavigator
            vagas={todasVagas}
            vagaSelecionadaId={vagaSelecionadaId}
            onSelecionarVaga={selecionarVaga}
          />
        )}
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topHeader: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  brandContainer: {
    paddingHorizontal: 18,
    marginBottom: 4,
  },
});

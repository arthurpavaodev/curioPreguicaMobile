import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Vaga } from '../../../../domain';
import { useTheme } from '../theme/ThemeContext';
import { fontNames } from '../theme/typography';
import { PainelTeiaScreen } from '../screens/teia/PainelTeiaScreen';
import { OportunidadesTeiaScreen } from '../screens/teia/OportunidadesTeiaScreen';

export type TeiaTabParamList = {
  Painel: undefined;
  Oportunidades: undefined;
};

const Tab = createBottomTabNavigator<TeiaTabParamList>();

interface TeiaNavigatorProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
}

export function TeiaNavigator({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
}: TeiaNavigatorProps) {
  const { cores } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.linha,
        },
        tabBarLabelStyle: {
          fontFamily: fontNames.plexSans600,
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen name="Painel" options={{ tabBarLabel: 'Painel' }}>
        {() => (
          <PainelTeiaScreen
            vagas={vagas}
            vagaSelecionadaId={vagaSelecionadaId}
            onSelecionarVaga={onSelecionarVaga}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Oportunidades" options={{ tabBarLabel: 'Oportunidades' }}>
        {({ navigation }) => (
          <OportunidadesTeiaScreen
            onVerRankingVaga={(vagaId) => {
              onSelecionarVaga(vagaId);
              navigation.navigate('Painel');
            }}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

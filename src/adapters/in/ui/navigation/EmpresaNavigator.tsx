import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Vaga } from '../../../../domain';
import { useTheme } from '../theme/ThemeContext';
import { fontNames } from '../theme/typography';
import { VagasEmpresaScreen } from '../screens/empresa/VagasEmpresaScreen';
import { CandidatosEmpresaScreen } from '../screens/empresa/CandidatosEmpresaScreen';

export type EmpresaTabParamList = {
  Vagas: undefined;
  Candidatos: undefined;
};

const Tab = createBottomTabNavigator<EmpresaTabParamList>();

interface EmpresaNavigatorProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
}

export function EmpresaNavigator({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
}: EmpresaNavigatorProps) {
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
      <Tab.Screen name="Vagas" options={{ tabBarLabel: 'Vagas' }}>
        {({ navigation }) => (
          <VagasEmpresaScreen
            onVerCandidatosVaga={(vagaId) => {
              onSelecionarVaga(vagaId);
              navigation.navigate('Candidatos');
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Candidatos" options={{ tabBarLabel: 'Candidatos' }}>
        {() => (
          <CandidatosEmpresaScreen
            vagas={vagas}
            vagaSelecionadaId={vagaSelecionadaId}
            onSelecionarVaga={onSelecionarVaga}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

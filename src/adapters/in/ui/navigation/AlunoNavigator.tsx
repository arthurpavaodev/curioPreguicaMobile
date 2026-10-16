import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Vaga } from '../../../../domain';
import { useTheme } from '../theme/ThemeContext';
import { fontNames } from '../theme/typography';
import { CurriculoScreen } from '../screens/aluno/CurriculoScreen';
import { VagasAlunoScreen } from '../screens/aluno/VagasAlunoScreen';
import { DiagnosticoScreen } from '../screens/aluno/DiagnosticoScreen';
import { PlanoDeVooScreen } from '../screens/aluno/PlanoDeVooScreen';

export type AlunoTabParamList = {
  Curriculo: undefined;
  Vagas: undefined;
  Diagnostico: undefined;
  PlanoDeVoo: undefined;
};

const Tab = createBottomTabNavigator<AlunoTabParamList>();

interface AlunoNavigatorProps {
  vagas: Vaga[];
  vagaSelecionadaId: string | null;
  onSelecionarVaga: (id: string) => void;
}

export function AlunoNavigator({
  vagas,
  vagaSelecionadaId,
  onSelecionarVaga,
}: AlunoNavigatorProps) {
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
      <Tab.Screen
        name="Curriculo"
        options={{ tabBarLabel: 'Currículo' }}
        component={CurriculoScreen}
      />
      <Tab.Screen name="Vagas" options={{ tabBarLabel: 'Vagas' }}>
        {({ navigation }) => (
          <VagasAlunoScreen
            onNavegarParaDiagnostico={(vagaId) => {
              onSelecionarVaga(vagaId);
              navigation.navigate('Diagnostico');
            }}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Diagnostico" options={{ tabBarLabel: 'Diagnóstico' }}>
        {({ navigation }) => (
          <DiagnosticoScreen
            vagas={vagas}
            vagaSelecionadaId={vagaSelecionadaId}
            onSelecionarVaga={onSelecionarVaga}
            onNavegarParaCurriculo={() => navigation.navigate('Curriculo')}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="PlanoDeVoo" options={{ tabBarLabel: 'Plano de voo' }}>
        {() => (
          <PlanoDeVooScreen
            vagas={vagas}
            vagaSelecionadaId={vagaSelecionadaId}
            onSelecionarVaga={onSelecionarVaga}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

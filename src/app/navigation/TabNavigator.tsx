import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppData } from '../providers/AppDataProvider';
import { useTheme } from '../providers/ThemeProvider';
import { fontNames } from '../../theme';
import { StudentDashboardScreen } from '../../features/curriculum/screens/StudentDashboardScreen';
import { CurriculumScreen } from '../../features/curriculum/screens/CurriculumScreen';
import { StudentJobsScreen } from '../../features/jobs/screens/StudentJobsScreen';
import { DiagnosisScreen } from '../../features/curriculum/screens/DiagnosisScreen';
import { FlightPlanScreen } from '../../features/flight-plan/screens/FlightPlanScreen';
import { TeiaDashboardScreen } from '../../features/teia/screens/TeiaDashboardScreen';
import { TeiaOpportunitiesScreen } from '../../features/teia/screens/TeiaOpportunitiesScreen';
import { CompanyJobsScreen } from '../../features/company/screens/CompanyJobsScreen';
import { CompanyCandidatesScreen } from '../../features/company/screens/CompanyCandidatesScreen';

export type StudentTabParamList = {
  Inicio: undefined;
  Curriculo: undefined;
  Vagas: undefined;
  Diagnostico: undefined;
  PlanoDeVoo: undefined;
};

export type TeiaTabParamList = {
  Painel: undefined;
  Oportunidades: undefined;
};

export type CompanyTabParamList = {
  Vagas: undefined;
  Candidatos: undefined;
};

const StudentTab = createBottomTabNavigator<StudentTabParamList>();
const TeiaTab = createBottomTabNavigator<TeiaTabParamList>();
const CompanyTab = createBottomTabNavigator<CompanyTabParamList>();

function TabIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <Text style={{ fontSize: 15, color, fontWeight: '700' }} accessible={false}>
      {symbol}
    </Text>
  );
}

export function StudentTabNavigator() {
  const { cores } = useTheme();

  return (
    <StudentTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.linha,
          height: 58,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fontNames.plexSans600,
          fontSize: 11.5,
        },
      }}
    >
      <StudentTab.Screen
        name="Inicio"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color }) => <TabIcon symbol="⌂" color={color} />,
        }}
      >
        {({ navigation }) => (
          <StudentDashboardScreen
            onIrParaCurriculo={() => navigation.navigate('Curriculo')}
            onIrParaVagas={() => navigation.navigate('Vagas')}
            onIrParaDiagnostico={() => navigation.navigate('Diagnostico')}
            onIrParaPlano={() => navigation.navigate('PlanoDeVoo')}
          />
        )}
      </StudentTab.Screen>

      <StudentTab.Screen
        name="Curriculo"
        component={CurriculumScreen}
        options={{
          tabBarLabel: 'Currículo',
          tabBarIcon: ({ color }) => <TabIcon symbol="≡" color={color} />,
        }}
      />

      <StudentTab.Screen
        name="Vagas"
        options={{
          tabBarLabel: 'Vagas',
          tabBarIcon: ({ color }) => <TabIcon symbol="◎" color={color} />,
        }}
      >
        {({ navigation }) => (
          <StudentJobsScreen
            onNavegarParaDiagnostico={() => navigation.navigate('Diagnostico')}
          />
        )}
      </StudentTab.Screen>

      <StudentTab.Screen
        name="Diagnostico"
        options={{
          tabBarLabel: 'Diagnóstico',
          tabBarIcon: ({ color }) => <TabIcon symbol="⊕" color={color} />,
        }}
      >
        {({ navigation }) => (
          <DiagnosisScreen
            onNavegarParaPlano={() => navigation.navigate('PlanoDeVoo')}
            onNavegarParaCurriculo={() => navigation.navigate('Curriculo')}
          />
        )}
      </StudentTab.Screen>

      <StudentTab.Screen
        name="PlanoDeVoo"
        component={FlightPlanScreen}
        options={{
          tabBarLabel: 'Plano de Voo',
          tabBarIcon: ({ color }) => <TabIcon symbol="✓" color={color} />,
        }}
      />
    </StudentTab.Navigator>
  );
}

export function TeiaTabNavigator() {
  const { cores } = useTheme();

  return (
    <TeiaTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.linha,
          height: 58,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fontNames.plexSans600,
          fontSize: 12,
        },
      }}
    >
      <TeiaTab.Screen
        name="Painel"
        component={TeiaDashboardScreen}
        options={{
          tabBarLabel: 'Painel TEIA',
          tabBarIcon: ({ color }) => <TabIcon symbol="▤" color={color} />,
        }}
      />
      <TeiaTab.Screen
        name="Oportunidades"
        options={{
          tabBarLabel: 'Oportunidades',
          tabBarIcon: ({ color }) => <TabIcon symbol="◎" color={color} />,
        }}
      >
        {({ navigation }) => (
          <TeiaOpportunitiesScreen
            onVerRankingVaga={() => navigation.navigate('Painel')}
          />
        )}
      </TeiaTab.Screen>
    </TeiaTab.Navigator>
  );
}

export function CompanyTabNavigator() {
  const { cores } = useTheme();

  return (
    <CompanyTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.linha,
          height: 58,
          paddingBottom: 6,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontFamily: fontNames.plexSans600,
          fontSize: 12,
        },
      }}
    >
      <CompanyTab.Screen
        name="Vagas"
        options={{
          tabBarLabel: 'Minhas Vagas',
          tabBarIcon: ({ color }) => <TabIcon symbol="◎" color={color} />,
        }}
      >
        {({ navigation }) => (
          <CompanyJobsScreen
            onVerCandidatosVaga={() => navigation.navigate('Candidatos')}
          />
        )}
      </CompanyTab.Screen>

      <CompanyTab.Screen
        name="Candidatos"
        component={CompanyCandidatesScreen}
        options={{
          tabBarLabel: 'Candidatos',
          tabBarIcon: ({ color }) => <TabIcon symbol="★" color={color} />,
        }}
      />
    </CompanyTab.Navigator>
  );
}

export function TabNavigator() {
  const { perfil } = useAppData();

  if (perfil === 'teia') return <TeiaTabNavigator />;
  if (perfil === 'empresa') return <CompanyTabNavigator />;
  return <StudentTabNavigator />;
}

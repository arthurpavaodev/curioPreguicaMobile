import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
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

// Ícones SVG Vetoriais Nativos com ViewBox 24x24 padronizada
function HomeIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V9.5z"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={focused ? color : 'none'}
        fillOpacity={focused ? 0.15 : 0}
      />
    </Svg>
  );
}

function CurriculumIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function JobsIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Rect
        x={2}
        y={7}
        width={20}
        height={14}
        rx={2}
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        fill={focused ? color : 'none'}
        fillOpacity={focused ? 0.15 : 0}
      />
      <Path
        d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function DiagnosisIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={focused ? 2.2 : 1.8} />
      <Path
        d="M12 8v8M8 12h8"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function FlightPlanIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={focused ? color : 'none'}
        fillOpacity={focused ? 0.15 : 0}
      />
    </Svg>
  );
}

function ChartIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 20V10M12 20V4M6 20v-6"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function CandidateIcon({ color, focused }: { color: string; focused: boolean }) {
  return (
    <Svg width={21} height={21} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
        stroke={color}
        strokeWidth={focused ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={9} cy={7} r={4} stroke={color} strokeWidth={focused ? 2.2 : 1.8} />
      <Path
        d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function StudentTabNavigator() {
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();

  // Cálculo seguro da barra inferior respeitando o Home Indicator do iPhone
  const tabBottomPadding = Math.max(insets.bottom, 6);
  const tabHeight = 52 + tabBottomPadding;

  return (
    <StudentTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.linha,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabBottomPadding,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: cores.isDark ? 0.35 : 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fontNames.plexSans600,
          fontSize: 10.5,
          marginTop: 2,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 48,
        },
      }}
    >
      <StudentTab.Screen
        name="Inicio"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, focused }) => <HomeIcon color={color} focused={focused} />,
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
          tabBarIcon: ({ color, focused }) => <CurriculumIcon color={color} focused={focused} />,
        }}
      />

      <StudentTab.Screen
        name="Vagas"
        options={{
          tabBarLabel: 'Vagas',
          tabBarIcon: ({ color, focused }) => <JobsIcon color={color} focused={focused} />,
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
          tabBarIcon: ({ color, focused }) => <DiagnosisIcon color={color} focused={focused} />,
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
          tabBarIcon: ({ color, focused }) => <FlightPlanIcon color={color} focused={focused} />,
        }}
      />
    </StudentTab.Navigator>
  );
}

export function TeiaTabNavigator() {
  const { cores } = useTheme();
  const insets = useSafeAreaInsets();
  const tabBottomPadding = Math.max(insets.bottom, 6);
  const tabHeight = 52 + tabBottomPadding;

  return (
    <TeiaTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.linha,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabBottomPadding,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: cores.isDark ? 0.35 : 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fontNames.plexSans600,
          fontSize: 11,
          marginTop: 2,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 48,
        },
      }}
    >
      <TeiaTab.Screen
        name="Painel"
        component={TeiaDashboardScreen}
        options={{
          tabBarLabel: 'Painel TEIA',
          tabBarIcon: ({ color, focused }) => <ChartIcon color={color} focused={focused} />,
        }}
      />
      <TeiaTab.Screen
        name="Oportunidades"
        options={{
          tabBarLabel: 'Oportunidades',
          tabBarIcon: ({ color, focused }) => <JobsIcon color={color} focused={focused} />,
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
  const insets = useSafeAreaInsets();
  const tabBottomPadding = Math.max(insets.bottom, 6);
  const tabHeight = 52 + tabBottomPadding;

  return (
    <CompanyTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: cores.destaque,
        tabBarInactiveTintColor: cores.textoSecundario,
        tabBarStyle: {
          backgroundColor: cores.superficie,
          borderTopColor: cores.linha,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: tabBottomPadding,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: cores.isDark ? 0.35 : 0.05,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontFamily: fontNames.plexSans600,
          fontSize: 11,
          marginTop: 2,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
          height: 48,
        },
      }}
    >
      <CompanyTab.Screen
        name="Vagas"
        options={{
          tabBarLabel: 'Minhas Vagas',
          tabBarIcon: ({ color, focused }) => <JobsIcon color={color} focused={focused} />,
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
          tabBarIcon: ({ color, focused }) => <CandidateIcon color={color} focused={focused} />,
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

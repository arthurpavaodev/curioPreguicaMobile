export interface ThemeColors {
  isDark: boolean;
  institucional: string;
  institucionalSuave: string;
  fundo: string;
  superficie: string;
  superficieSecundaria: string;
  tinta: string;
  textoSecundario: string;
  linha: string;
  destaque: string; // Azul Royal CREA-MA (#0057FF)
  destaqueTexto: string;
  destaqueSuave: string;
  laranjaDestaque: string; // Laranja "profissionais" CREA-MA (#FF6B2C)
  cardEstudante: string; // Azul Royal (#0057FF)
  cardProfissional: string; // Verde Esmeralda (#2E9B68)
  cardEmpresa: string; // Laranja Terracota (#EB7A44)
  ok: string;
  okSuave: string;
  atencao: string;
  atencaoSuave: string;
  erro: string;
  erroSuave: string;
}

export const coresClaro: ThemeColors = {
  isDark: false,
  institucional: '#0F172A',
  institucionalSuave: '#1E293B',
  fundo: '#FAFBFC', // Fundo quase branco ultra limpo estilo CREA-MA
  superficie: '#FFFFFF',
  superficieSecundaria: '#F4F6F9',
  tinta: '#0A0D14', // Preto nítido para títulos de alto contraste
  textoSecundario: '#667085', // Cinza equilibrado para subtítulos
  linha: '#ECEEF2', // Bordas muito sutis dos cards Bento
  destaque: '#0057FF', // Azul Royal vibrante CREA-MA
  destaqueTexto: '#FFFFFF',
  destaqueSuave: '#EBF2FF',
  laranjaDestaque: '#FF6B2C', // Laranja destaque do título Hero
  cardEstudante: '#0057FF',
  cardProfissional: '#2E9B68',
  cardEmpresa: '#EB7A44',
  ok: '#16A34A',
  okSuave: '#DCFCE7',
  atencao: '#D97706',
  atencaoSuave: '#FEF3C7',
  erro: '#E11D48',
  erroSuave: '#FFE4E6',
};

export const coresEscuro: ThemeColors = {
  isDark: true,
  institucional: '#090D16',
  institucionalSuave: '#161F30',
  fundo: '#0B0F17',
  superficie: '#131A27',
  superficieSecundaria: '#1A2333',
  tinta: '#F9FAFB',
  textoSecundario: '#9CA3AF',
  linha: '#222E42',
  destaque: '#3B82F6',
  destaqueTexto: '#FFFFFF',
  destaqueSuave: '#172554',
  laranjaDestaque: '#FF7A45',
  cardEstudante: '#0057FF',
  cardProfissional: '#2E9B68',
  cardEmpresa: '#EB7A44',
  ok: '#22C55E',
  okSuave: '#064E3B',
  atencao: '#F59E0B',
  atencaoSuave: '#451A03',
  erro: '#F43F5E',
  erroSuave: '#4C0519',
};

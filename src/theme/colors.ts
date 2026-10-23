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
  fundo: '#FAFBFC', // Fundo quase branco ultra limpo estilo CREA-MA (aprovado pelo usuário)
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
  // Base Zinc / Apple Neutro de Alto Contraste (elimina o tom azul-lama)
  institucional: '#09090B',
  institucionalSuave: '#18181B',
  fundo: '#09090B', // Preto profundo neutro OLED
  superficie: '#141417', // Cartões e TabBar: grafite elegante
  superficieSecundaria: '#1F1F24', // Inputs e chips
  tinta: '#F4F4F5', // Branco suave de alta legibilidade (Zinc 100)
  textoSecundario: '#A1A1AA', // Cinza neutro legível (Zinc 400 - WCAG AAA)
  linha: '#27272A', // Bordas nítidas de 1px
  destaque: '#2563EB', // Azul Royal puro e vibrante
  destaqueTexto: '#FFFFFF',
  destaqueSuave: '#1E293B',
  laranjaDestaque: '#FB923C', // Laranja iluminado
  cardEstudante: '#3B82F6',
  cardProfissional: '#10B981',
  cardEmpresa: '#F97316',
  ok: '#22C55E',
  okSuave: '#052E16',
  atencao: '#F59E0B',
  atencaoSuave: '#451A03',
  erro: '#EF4444',
  erroSuave: '#450A0A',
};

export interface ThemeColors {
  isDark: boolean;
  fundo: string;
  superficie: string;
  tinta: string;
  textoSecundario: string;
  linha: string;
  destaque: string;
  destaqueTexto: string;
  destaqueSuave: string;
  ok: string;
  okSuave: string;
  atencao: string;
  atencaoSuave: string;
  erro: string;
  erroSuave: string;
}

export const coresClaro: ThemeColors = {
  isDark: false,
  fundo: '#EDF0F3',
  superficie: '#FFFFFF',
  tinta: '#0F2438',
  textoSecundario: '#586A7C',
  linha: '#D3DBE3',
  destaque: '#C93F0B',
  destaqueTexto: '#FFFFFF',
  destaqueSuave: '#FCE9DF',
  ok: '#17704F',
  okSuave: '#DDF1E8',
  atencao: '#8F5600',
  atencaoSuave: '#FFEFD0',
  erro: '#A7261B',
  erroSuave: '#FBE3E0',
};

export const coresEscuro: ThemeColors = {
  isDark: true,
  fundo: '#09151F',
  superficie: '#10212F',
  tinta: '#E7EDF3',
  textoSecundario: '#92A3B4',
  linha: '#223547',
  destaque: '#FF8B4E',
  destaqueTexto: '#1A0C04',
  destaqueSuave: '#2D1B10',
  ok: '#4FCBA2',
  okSuave: '#0F2F26',
  atencao: '#F2B44D',
  atencaoSuave: '#33270F',
  erro: '#FF9185',
  erroSuave: '#35191B',
};

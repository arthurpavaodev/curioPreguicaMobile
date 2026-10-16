export type TipoCompetencia = 'tech' | 'soft' | 'idioma';

export interface Competencia {
  id: string;
  rotulo: string;
  tipo: TipoCompetencia;
  aliases: string[];
}

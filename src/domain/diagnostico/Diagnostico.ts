import { ItemOrtografico } from '../curriculo/VerificadorOrtografico';
import { Requisito } from '../vaga/Requisito';
import { NivelDeAderencia } from './NivelDeAderencia';

export interface RequisitoAtendido {
  requisito: Requisito;
  evidencia: string;
}

export interface RequisitoFaltante {
  requisito: Requisito;
  obrigatorio: boolean; // true se peso === 2, false se peso === 1
  acaoSugerida: string;
}

export interface Diagnostico {
  vagaId: string;
  aderencia: number | null;
  nivel: NivelDeAderencia;
  totalRequisitos: number;
  requisitosAtendidosCount: number;
  requisitosAtendidos: RequisitoAtendido[];
  requisitosFaltantes: RequisitoFaltante[];
  pontosFortes: string[];
  pontosFracos: string[];
  ortografia: ItemOrtografico[];
  origemAnalise: 'basica' | 'ia';
}

export type TipoNivelAderencia = 'boa' | 'parcial' | 'baixa' | 'sem_requisitos';

export interface NivelDeAderencia {
  tipo: TipoNivelAderencia;
  rotulo: string;
}

export function obterNivelDeAderencia(aderencia: number | null): NivelDeAderencia {
  if (aderencia === null) {
    return {
      tipo: 'sem_requisitos',
      rotulo: 'Sem requisitos reconhecidos',
    };
  }

  if (aderencia >= 75) {
    return {
      tipo: 'boa',
      rotulo: 'Boa aderência',
    };
  }

  if (aderencia >= 45) {
    return {
      tipo: 'parcial',
      rotulo: 'Aderência parcial',
    };
  }

  return {
    tipo: 'baixa',
    rotulo: 'Baixa aderência',
  };
}

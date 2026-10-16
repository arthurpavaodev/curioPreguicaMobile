import { GeradorDeId } from '../../../application';

export class GeradorDeIdSimples implements GeradorDeId {
  private contador = 1;

  constructor(private prefixo = 'id_') {}

  novo(): string {
    return `${this.prefixo}${Date.now()}_${this.contador++}`;
  }
}

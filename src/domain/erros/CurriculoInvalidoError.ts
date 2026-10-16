export class CurriculoInvalidoError extends Error {
  constructor(mensagem = 'O currículo fornecido é inválido.') {
    super(mensagem);
    this.name = 'CurriculoInvalidoError';
  }
}

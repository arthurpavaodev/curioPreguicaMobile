export class VagaInvalidaError extends Error {
  constructor(mensagem = 'Informe o título e a descrição da vaga com no mínimo 10 caracteres.') {
    super(mensagem);
    this.name = 'VagaInvalidaError';
  }
}

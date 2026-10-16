import {
  AvaliadorDeCurriculo,
  CalculadoraDeAderencia,
  ExtratorDeRequisitos,
  GeradorDePlano,
  Vaga,
} from '../../src/domain';
import { CURRICULO_EXEMPLO, TEXTO_VAGA_EX1 } from './criteriosDeAceite.test';

describe('AvaliadorDeCurriculo e GeradorDePlano', () => {
  const vagaEx1: Vaga = {
    id: 'ex1',
    titulo: 'Estágio em Desenvolvimento Mobile',
    empresa: 'Empresa Exemplo A',
    descricao: TEXTO_VAGA_EX1,
    origem: 'exemplo',
    requisitos: ExtratorDeRequisitos.extrair(TEXTO_VAGA_EX1),
  };

  test('avalia o currículo de exemplo com seções completas, e-mail, link e contagem de palavras', () => {
    const avaliacao = AvaliadorDeCurriculo.avaliar(CURRICULO_EXEMPLO);
    expect(avaliacao.totalPalavras).toBeGreaterThan(120);
    expect(avaliacao.totalPalavras).toBeLessThan(700);
    expect(avaliacao.secoesDetectadas.objetivo).toBe(true);
    expect(avaliacao.secoesDetectadas.formacao).toBe(true);
    expect(avaliacao.secoesDetectadas.projetos).toBe(true);
    expect(avaliacao.secoesDetectadas.habilidades).toBe(true);
    expect(avaliacao.secoesDetectadas.idiomas).toBe(true);
    expect(avaliacao.pontosFortes).toContain(
      'Estrutura completa: objetivo, formação, projetos ou experiência e habilidades.',
    );
    expect(avaliacao.pontosFortes).toContain('Há e-mail de contato.');
    expect(avaliacao.pontosFortes).toContain('Inclui link de GitHub ou LinkedIn.');
    expect(avaliacao.pontosFortes).toContain('Mostra resultados com números.');
  });

  test('gera plano de voo com etapas ordenadas por currículo e competências e persiste progresso', () => {
    const diag = CalculadoraDeAderencia.calcular(CURRICULO_EXEMPLO, vagaEx1);
    const planoInicial = GeradorDePlano.gerar(diag, {});

    expect(planoInicial.totalEtapas).toBeGreaterThan(0);
    expect(planoInicial.concluidasCount).toBe(0);
    expect(planoInicial.progresso).toBe(0);

    // Primeiro grupo é curriculo
    expect(planoInicial.etapas[0].grupo).toBe('curriculo');
    expect(planoInicial.etapas[0].titulo).toBe('Adaptar o currículo a esta vaga');

    // Tem etapa de ortografia
    const etapaOrtografia = planoInicial.etapas.find((e) => e.titulo === 'Corrigir a ortografia');
    expect(etapaOrtografia).toBeDefined();

    // Tem etapas de desenvolver competências (TypeScript e Testes automatizados)
    const etapasComp = planoInicial.etapas.filter((e) => e.grupo === 'competencias');
    expect(etapasComp.map((e) => e.titulo)).toContain('Desenvolver: TypeScript');
    expect(etapasComp.map((e) => e.titulo)).toContain('Desenvolver: Testes automatizados (diferencial)');

    // Marca a primeira etapa
    const primeiraId = planoInicial.etapas[0].id;
    const planoComProgresso = GeradorDePlano.gerar(diag, { [primeiraId]: true });
    expect(planoComProgresso.concluidasCount).toBe(1);
    expect(planoComProgresso.progresso).toBe(
      Math.round((100 * 1) / planoComProgresso.totalEtapas),
    );
    expect(planoComProgresso.etapas[0].concluida).toBe(true);
  });
});

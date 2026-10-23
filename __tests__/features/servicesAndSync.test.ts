import AsyncStorage from '@react-native-async-storage/async-storage';
import { curriculumService } from '../../src/features/curriculum/services/curriculumService';
import { jobService } from '../../src/features/jobs/services/jobService';
import { flightPlanService } from '../../src/features/flight-plan/services/flightPlanService';
import { RankeadorDeAlunos } from '../../src/domain';
import { ALUNOS_EXEMPLO, CURRICULO_EXEMPLO, TEXTO_VAGA_EX1 } from '../domain/criteriosDeAceite.test';

describe('Serviços e Fluxos Sincronizados das Features', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('edição do currículo reflete no diagnóstico e recalcula o Plano de Voo mantendo o progresso', async () => {
    const curriculoSalvo = await curriculumService.salvarCurriculo(CURRICULO_EXEMPLO);
    const vagas = await jobService.listarVagas('aluno');
    const vagaEx1 = vagas.find((v) => v.id === 'ex1')!;

    // Diagnóstico inicial com currículo de exemplo (77%)
    const diagInicial = jobService.diagnosticar(curriculoSalvo.texto, vagaEx1);
    expect(diagInicial.aderencia).toBe(77);

    // Gera plano e marca primeira etapa como concluída
    const progressoInicial = await flightPlanService.obterProgresso();
    const planoInicial = flightPlanService.gerarPlano(
      curriculoSalvo.texto,
      vagaEx1,
      progressoInicial,
    );
    expect(planoInicial.progresso).toBe(0);

    const primeiraEtapaId = planoInicial.etapas[0].id;
    const progressoAtualizado = await flightPlanService.alternarEtapa(primeiraEtapaId, true);

    const planoComCheck = flightPlanService.gerarPlano(
      curriculoSalvo.texto,
      vagaEx1,
      progressoAtualizado,
    );
    expect(planoComCheck.concluidasCount).toBe(1);

    // Quando o aluno adiciona TypeScript e Jest ao currículo, a aderência sobe para 100%
    const textoEvoluido = `${CURRICULO_EXEMPLO}\nTypeScript e testes automatizados com Jest.`;
    const curriculoEvoluido = await curriculumService.salvarCurriculo(textoEvoluido);

    const diagEvoluido = jobService.diagnosticar(curriculoEvoluido.texto, vagaEx1);
    expect(diagEvoluido.aderencia).toBe(100);
    expect(diagEvoluido.requisitosFaltantes).toHaveLength(0);

    // O Plano de Voo recalcula removendo as competências já adquiridas
    const planoEvoluido = flightPlanService.gerarPlano(
      curriculoEvoluido.texto,
      vagaEx1,
      progressoAtualizado,
    );
    const etapasCompetenciasRestantes = planoEvoluido.etapas.filter(
      (e) => e.grupo === 'competencias',
    );
    expect(etapasCompetenciasRestantes).toHaveLength(0);
  });

  test('resumo do painel TEIA e contagem de compatibilidade por vaga', async () => {
    const vagas = await jobService.listarVagas('teia');
    const vagaEx1 = vagas.find((v) => v.id === 'ex1')!;

    const resumo = RankeadorDeAlunos.resumirPainel(ALUNOS_EXEMPLO, vagaEx1);
    expect(resumo.cadastrados).toBe(6);
    expect(resumo.comCurriculo).toBe(5);
    expect(resumo.aderenciaMedia).toBe(41);

    const contagem = RankeadorDeAlunos.contarCompativeisPorVaga(ALUNOS_EXEMPLO, vagas, 60);
    expect(contagem['ex1'].compativeis).toBe(1);
    expect(contagem['ex2'].compativeis).toBe(1);
    expect(contagem['ex3'].compativeis).toBe(1);
  });

  test('avaliação completa do currículo retorna competências reconhecidas e score de preparação', () => {
    const analise = curriculumService.avaliar(CURRICULO_EXEMPLO);
    expect(analise.competenciasReconhecidas.length).toBeGreaterThanOrEqual(6);
    expect(analise.scorePreparacao).toBeGreaterThanOrEqual(80);

    const analiseVazia = curriculumService.avaliar('');
    expect(analiseVazia.scorePreparacao).toBe(0);
  });
});

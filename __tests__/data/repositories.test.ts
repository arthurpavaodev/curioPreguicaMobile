import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CurriculumRepository,
  FlightPlanRepository,
  JobRepository,
  PreferencesRepository,
} from '../../src/data';
import { Vaga, VagaInvalidaError } from '../../src/domain';

describe('Repositórios de Persistência Local (AsyncStorage)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('CurriculumRepository inicializa com exemplo e permite salvarTexto e limpar', async () => {
    const repo = new CurriculumRepository();

    // Primeiro acesso inicializa com o exemplo
    const inicial = await repo.obter();
    expect(inicial).not.toBeNull();
    expect(inicial.texto).toContain('NOME DO ALUNO (exemplo)');

    // Salvar novo texto
    const salvo = await repo.salvarTexto('Objetivo: Estágio em React Native e TypeScript');
    expect(salvo.texto).toBe('Objetivo: Estágio em React Native e TypeScript');
    expect(salvo.secoesDetectadas.objetivo).toBe(true);

    const recuperado = await repo.obter();
    expect(recuperado.texto).toBe('Objetivo: Estágio em React Native e TypeScript');

    // Limpar
    const limpo = await repo.limpar();
    expect(limpo.texto).toBe('');
    expect(limpo.palavras).toBe(0);
  });

  test('JobRepository lista exemplos, cria vagas personalizadas com filtro por perfil e remove', async () => {
    const repo = new JobRepository();

    const exemplos = await repo.listarExemplos();
    expect(exemplos).toHaveLength(3);
    expect(exemplos.map((v) => v.id)).toEqual(['ex1', 'ex2', 'ex3']);

    // Criar vaga do aluno
    const vagaAluno: Vaga = await repo.criarEAdicionar({
      titulo: 'Estágio Frontend',
      texto: 'Requisitos:\n- React\n- TypeScript',
      origem: 'aluno',
    });

    expect(vagaAluno.id).toBeDefined();
    expect(vagaAluno.requisitos.length).toBe(2);

    // Aluno vê exemplos + sua vaga (4)
    expect(await repo.listarTodas('aluno')).toHaveLength(4);
    // TEIA e Empresa não veem rascunhos colados por aluno (3)
    expect(await repo.listarTodas('teia')).toHaveLength(3);
    expect(await repo.listarTodas('empresa')).toHaveLength(3);

    // Remover vaga personalizada
    await repo.remover(vagaAluno.id);
    expect(await repo.listarTodas('aluno')).toHaveLength(3);

    // Protege vaga de exemplo contra remoção
    await repo.remover('ex1');
    expect(await repo.listarTodas('aluno')).toHaveLength(3);

    // Valida vaga inválida
    await expect(
      repo.criarEAdicionar({
        titulo: 'A',
        texto: 'curto',
        origem: 'empresa',
      }),
    ).rejects.toThrow(VagaInvalidaError);
  });

  test('FlightPlanRepository persiste conclusão de etapas entre sessões', async () => {
    const repo = new FlightPlanRepository();

    expect(await repo.obter()).toEqual({});

    await repo.definir('etapa_1', true);
    await repo.definir('etapa_2', false);

    const mapa = await repo.obter();
    expect(mapa['etapa_1']).toBe(true);
    expect(mapa['etapa_2']).toBe(false);
  });

  test('PreferencesRepository gerencia perfil ativo e vaga selecionada', async () => {
    const repo = new PreferencesRepository();

    expect(await repo.obterPerfil()).toBe('aluno');
    expect(await repo.obterVagaSelecionadaId()).toBe('ex1');

    await repo.salvarPerfil('teia');
    expect(await repo.obterPerfil()).toBe('teia');

    await repo.salvarVagaSelecionadaId('ex2');
    expect(await repo.obterVagaSelecionadaId()).toBe('ex2');
  });
});

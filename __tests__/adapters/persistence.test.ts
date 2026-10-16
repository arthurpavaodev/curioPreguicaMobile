import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AsyncStorageCurriculoRepository,
  AsyncStoragePreferenciasRepository,
  AsyncStorageProgressoDoPlanoRepository,
  AsyncStorageVagaRepository,
} from '../../src/adapters/out';
import { Vaga } from '../../src/domain';

describe('Adaptadores de Persistência com AsyncStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  test('AsyncStorageCurriculoRepository inicializa com exemplo e permite salvar e limpar', async () => {
    const repo = new AsyncStorageCurriculoRepository();

    // Primeiro acesso: inicializa com o exemplo
    const inicial = await repo.obter();
    expect(inicial).not.toBeNull();
    expect(inicial?.texto).toContain('NOME DO ALUNO (exemplo)');

    // Salvar novo currículo
    await repo.salvar({
      texto: 'Novo curriculo',
      palavras: 2,
      secoesDetectadas: {
        objetivo: false,
        formacao: false,
        projetos: false,
        habilidades: false,
        idiomas: false,
      },
      atualizadoEm: new Date().toISOString(),
    });

    const atualizado = await repo.obter();
    expect(atualizado?.texto).toBe('Novo curriculo');

    // Limpar
    await repo.limpar();
    const limpo = await repo.obter();
    expect(limpo?.texto).toBe('');
    expect(limpo?.palavras).toBe(0);
  });

  test('AsyncStorageVagaRepository lista exemplos, adiciona e remove personalizadas', async () => {
    const repo = new AsyncStorageVagaRepository();

    const exemplos = await repo.listarExemplos();
    expect(exemplos).toHaveLength(3);
    expect(exemplos.map((v) => v.id)).toEqual(['ex1', 'ex2', 'ex3']);

    const personalizadasIniciais = await repo.listarPersonalizadas();
    expect(personalizadasIniciais).toHaveLength(0);

    const novaVaga: Vaga = {
      id: 'custom_1',
      titulo: 'Desenvolvedor Frontend',
      empresa: 'Empresa Teste',
      descricao: 'Requisitos:\n- React\n- TypeScript',
      origem: 'empresa',
      requisitos: [],
    };

    await repo.adicionar(novaVaga);

    const personalizadasAposAdd = await repo.listarPersonalizadas();
    expect(personalizadasAposAdd).toHaveLength(1);
    expect(personalizadasAposAdd[0].id).toBe('custom_1');

    const vagaObtida = await repo.obterPorId('custom_1');
    expect(vagaObtida?.titulo).toBe('Desenvolvedor Frontend');

    await repo.remover('custom_1');
    const personalizadasAposRemover = await repo.listarPersonalizadas();
    expect(personalizadasAposRemover).toHaveLength(0);
  });

  test('AsyncStorageProgressoDoPlanoRepository armazena e recupera progresso por etapaId', async () => {
    const repo = new AsyncStorageProgressoDoPlanoRepository();

    const inicial = await repo.obter();
    expect(inicial).toEqual({});

    await repo.definir('etapa_123', true);
    await repo.definir('etapa_456', false);

    const atualizado = await repo.obter();
    expect(atualizado['etapa_123']).toBe(true);
    expect(atualizado['etapa_456']).toBe(false);
  });

  test('AsyncStoragePreferenciasRepository gerencia perfil e vaga selecionada', async () => {
    const repo = new AsyncStoragePreferenciasRepository();

    expect(await repo.obterPerfil()).toBe('aluno');
    expect(await repo.obterVagaSelecionadaId()).toBe('ex1');

    await repo.salvarPerfil('teia');
    expect(await repo.obterPerfil()).toBe('teia');

    await repo.salvarVagaSelecionadaId('ex2');
    expect(await repo.obterVagaSelecionadaId()).toBe('ex2');
  });
});

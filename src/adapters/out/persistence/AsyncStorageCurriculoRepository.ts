import AsyncStorage from '@react-native-async-storage/async-storage';
import { Curriculo } from '../../../domain';
import { CurriculoRepository } from '../../../application';
import { criarCurriculoExemplo } from '../seed/SeedData';

const STORAGE_KEY = '@plano_de_voo:curriculo';

export class AsyncStorageCurriculoRepository implements CurriculoRepository {
  async obter(): Promise<Curriculo | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com o currículo de exemplo se ainda não houver nenhum salvo
        const exemplo = criarCurriculoExemplo();
        await this.salvar(exemplo);
        return exemplo;
      }
      return JSON.parse(data) as Curriculo;
    } catch {
      return null;
    }
  }

  async salvar(curriculo: Curriculo): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(curriculo));
    } catch (error) {
      console.error('Erro ao salvar currículo no AsyncStorage:', error);
    }
  }

  async limpar(): Promise<void> {
    try {
      // Cria currículo vazio com contagem 0
      const vazio: Curriculo = {
        texto: '',
        palavras: 0,
        secoesDetectadas: {
          objetivo: false,
          formacao: false,
          projetos: false,
          habilidades: false,
          idiomas: false,
        },
        atualizadoEm: new Date().toISOString(),
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(vazio));
    } catch (error) {
      console.error('Erro ao limpar currículo no AsyncStorage:', error);
    }
  }
}

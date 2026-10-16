import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressoDoPlanoRepository } from '../../../application';

const STORAGE_KEY = '@plano_de_voo:progresso_plano';

export class AsyncStorageProgressoDoPlanoRepository implements ProgressoDoPlanoRepository {
  async obter(): Promise<Record<string, boolean>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return {};
      return JSON.parse(data) as Record<string, boolean>;
    } catch {
      return {};
    }
  }

  async definir(etapaId: string, concluida: boolean): Promise<void> {
    try {
      const atual = await this.obter();
      atual[etapaId] = concluida;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atual));
    } catch (error) {
      console.error('Erro ao salvar progresso do plano no AsyncStorage:', error);
    }
  }
}

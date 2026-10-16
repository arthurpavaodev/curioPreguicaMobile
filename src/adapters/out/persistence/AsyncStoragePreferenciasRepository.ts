import AsyncStorage from '@react-native-async-storage/async-storage';
import { PerfilUsuario, PreferenciasRepository } from '../../../application';

const PERFIL_KEY = '@plano_de_voo:perfil';
const VAGA_KEY = '@plano_de_voo:vaga_selecionada_id';

export class AsyncStoragePreferenciasRepository implements PreferenciasRepository {
  async obterPerfil(): Promise<PerfilUsuario> {
    try {
      const data = await AsyncStorage.getItem(PERFIL_KEY);
      if (data === 'teia' || data === 'empresa' || data === 'aluno') {
        return data;
      }
      return 'aluno';
    } catch {
      return 'aluno';
    }
  }

  async salvarPerfil(perfil: PerfilUsuario): Promise<void> {
    try {
      await AsyncStorage.setItem(PERFIL_KEY, perfil);
    } catch (error) {
      console.error('Erro ao salvar perfil no AsyncStorage:', error);
    }
  }

  async obterVagaSelecionadaId(): Promise<string | null> {
    try {
      const data = await AsyncStorage.getItem(VAGA_KEY);
      return data || 'ex1';
    } catch {
      return 'ex1';
    }
  }

  async salvarVagaSelecionadaId(id: string | null): Promise<void> {
    try {
      if (id === null) {
        await AsyncStorage.removeItem(VAGA_KEY);
      } else {
        await AsyncStorage.setItem(VAGA_KEY, id);
      }
    } catch (error) {
      console.error('Erro ao salvar vaga selecionada no AsyncStorage:', error);
    }
  }
}

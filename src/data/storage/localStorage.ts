import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export const STORAGE_KEYS = {
  CURRICULO: '@plano_de_voo:curriculo',
  VAGAS_PERSONALIZADAS: '@plano_de_voo:vagas_personalizadas',
  PROGRESSO_PLANO: '@plano_de_voo:progresso_plano',
  PERFIL: '@plano_de_voo:perfil',
  VAGA_SELECIONADA_ID: '@plano_de_voo:vaga_selecionada_id',
} as const;

export const localStorageService = {
  async getJSON<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  async setJSON<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Erro ao salvar chave ${key} no AsyncStorage:`, error);
    }
  },

  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async setString(key: string, value: string | null): Promise<void> {
    try {
      if (value === null) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Erro ao salvar string na chave ${key}:`, error);
    }
  },
};

export async function importarArquivoTxt(): Promise<string | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/plain',
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const fileUri = result.assets[0].uri;
    const conteudo = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType?.UTF8 || 'utf8',
    });

    return conteudo;
  } catch (error) {
    console.warn('Erro ao ler arquivo de currículo:', error);
    return null;
  }
}

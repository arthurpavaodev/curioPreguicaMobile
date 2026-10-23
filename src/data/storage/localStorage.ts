import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { File } from 'expo-file-system';
import * as FileSystemLegacy from 'expo-file-system/legacy';
import { extrairTextoDePdf } from '../../domain/pdfExtractor';

export const STORAGE_KEYS = {
  CURRICULO: '@plano_de_voo:curriculo',
  VAGAS_PERSONALIZADAS: '@plano_de_voo:vagas_personalizadas',
  PROGRESSO_PLANO: '@plano_de_voo:progresso_plano',
  PERFIL: '@plano_de_voo:perfil',
  VAGA_SELECIONADA_ID: '@plano_de_voo:vaga_selecionada_id',
  CANDIDATURAS: '@plano_de_voo:candidaturas',
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

export interface ResultadoImportacaoPdf {
  texto: string;
  nomeArquivo: string;
  tamanhoBytes?: number;
}

/**
 * Lê os dados de um arquivo como bytes (Uint8Array) ou base64, utilizando a nova API
 * `File` do expo-file-system (SDK 54+) com fallback seguro para `expo-file-system/legacy`.
 */
async function lerDadosDoArquivo(fileUri: string): Promise<Uint8Array | string> {
  // 1. Tentar nova API orientada a objetos (File class)
  try {
    const file = new File(fileUri);
    if (typeof file.bytes === 'function') {
      const bytes = await file.bytes();
      if (bytes && bytes.length > 0) {
        return bytes;
      }
    }
    if (typeof file.base64 === 'function') {
      const b64 = await file.base64();
      if (b64 && b64.length > 0) {
        return b64;
      }
    }
  } catch (err) {
    console.warn('Leitura com new File() falhou, tentando legacy API:', err);
  }

  // 2. Fallback para legacy API
  const base64 = await FileSystemLegacy.readAsStringAsync(fileUri, {
    encoding: FileSystemLegacy.EncodingType.Base64,
  });
  return base64;
}

/**
 * Lê o conteúdo textual de um arquivo (UTF-8).
 */
async function lerTextoDoArquivo(fileUri: string): Promise<string> {
  try {
    const file = new File(fileUri);
    if (typeof file.text === 'function') {
      const txt = await file.text();
      if (txt !== undefined && txt !== null) {
        return txt;
      }
    }
  } catch (err) {
    console.warn('Leitura com new File().text() falhou, tentando legacy API:', err);
  }

  return await FileSystemLegacy.readAsStringAsync(fileUri, {
    encoding: FileSystemLegacy.EncodingType.UTF8,
  });
}

/**
 * Importa estritamente arquivo no formato PDF, extrai seu texto e retorna o resultado estruturado.
 */
export async function importarArquivoPdf(): Promise<ResultadoImportacaoPdf | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf'],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const fileUri = asset.uri;
    const nomeArquivo = asset.name || 'curriculo.pdf';
    const tamanhoBytes = asset.size;

    if (
      nomeArquivo &&
      !nomeArquivo.toLowerCase().endsWith('.pdf') &&
      asset.mimeType !== 'application/pdf'
    ) {
      throw new Error('Apenas arquivos no formato PDF são aceitos obrigatoriamente.');
    }

    const dados = await lerDadosDoArquivo(fileUri);
    const textoExtraido = extrairTextoDePdf(dados);

    return {
      texto: textoExtraido,
      nomeArquivo,
      tamanhoBytes,
    };
  } catch (error) {
    console.warn('Erro ao ler e extrair arquivo PDF de currículo:', error);
    throw error;
  }
}

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
    const conteudo = await lerTextoDoArquivo(fileUri);

    return conteudo;
  } catch (error) {
    console.warn('Erro ao ler arquivo de currículo:', error);
    return null;
  }
}

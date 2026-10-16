import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { LeitorDeArquivoDeCurriculo } from '../../../application';

export class DocumentPickerLeitorDeArquivo implements LeitorDeArquivoDeCurriculo {
  async escolherEler(): Promise<string | null> {
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
}

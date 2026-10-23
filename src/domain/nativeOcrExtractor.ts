import ReactNativeTextRecognition, {
  recognizeText,
  TextRecognitionResult,
} from '@dariyd/react-native-text-recognition';
import { extrairTextoDePdf } from './pdfExtractor';

export interface OpcoesOcr {
  preferirNativo?: boolean;
  permitirFallbackCloud?: boolean;
  dpi?: number;
}

export interface ResultadoExtracaoPdfCompleta {
  texto: string;
  metodo: 'native-ocr' | 'digital' | 'cloud-ocr' | 'nenhum';
  origem: string;
}

/**
 * Verifica de forma segura se o módulo nativo de OCR está linkado e disponível no runtime
 * (retorna true em Development Builds no Android/iOS, e false no Expo Go padrão).
 */
export async function verificarDisponibilidadeOcrNativo(): Promise<boolean> {
  try {
    if (ReactNativeTextRecognition && typeof ReactNativeTextRecognition.isAvailable === 'function') {
      return await ReactNativeTextRecognition.isAvailable();
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Extrai texto do arquivo PDF local utilizando Google ML Kit (Android) ou Apple Vision (iOS) nativo.
 * Requer Development Build (npx expo run:android / run:ios).
 */
export async function extrairTextoViaOcrNativo(
  fileUri: string,
  dpi = 400
): Promise<string | null> {
  try {
    const result: TextRecognitionResult = await recognizeText(fileUri, {
      languages: ['pt', 'por', 'en'],
      recognitionLevel: 'line',
      pdfDpi: dpi,
      preprocessImages: true,
    });

    if (result && result.fullText && result.fullText.trim().length > 0) {
      return result.fullText.trim();
    }

    if (result && result.pages && result.pages.length > 0) {
      const textoMontado = result.pages
        .map((page) => page.fullText || (page.elements ? page.elements.map((e) => e.text).join(' ') : ''))
        .filter(Boolean)
        .join('\n')
        .trim();

      if (textoMontado.length > 0) {
        return textoMontado;
      }
    }

    return null;
  } catch (error) {
    // Quando executado em Expo Go, o módulo nativo lança erro de linking esperado
    const msg = error instanceof Error ? error.message : String(error);
    if (!msg.includes('Expo Go') && !msg.includes('not seem to be linked')) {
      console.warn('Erro durante execução do OCR nativo:', error);
    }
    return null;
  }
}

/**
 * Fallback de OCR em nuvem (OCR.space com suporte a português) para quando o app
 * for executado dentro do Expo Go antes de gerar o Development Build nativo.
 */
export async function extrairTextoViaOcrCloud(base64OuDataUri: string): Promise<string | null> {
  try {
    let base64Pdf = base64OuDataUri;
    if (!base64Pdf.startsWith('data:application/pdf;base64,')) {
      base64Pdf = `data:application/pdf;base64,${base64OuDataUri.replace(/^data:.*?;base64,/, '').replace(/\s+/g, '')}`;
    }

    const payload = new URLSearchParams({
      apikey: 'K87899142388957', // Chave pública com suporte a Português e PDFs
      language: 'por',
      filetype: 'PDF',
      isOverlayRequired: 'false',
      base64Image: base64Pdf,
    });

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: payload.toString(),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data && data.ParsedResults && Array.isArray(data.ParsedResults)) {
      const textos = data.ParsedResults.map((r: { ParsedText?: string }) => r.ParsedText || '')
        .filter(Boolean)
        .join('\n')
        .trim();

      return textos.length > 0 ? textos : null;
    }

    return null;
  } catch (err) {
    console.warn('Fallback de OCR em nuvem falhou ou sem conexão:', err);
    return null;
  }
}

/**
 * Pipeline completo de extração de texto em PDF com 3 camadas de resiliência:
 * 1. OCR Nativo On-Device (Google ML Kit no Android / Apple Vision no iOS para Development Build)
 * 2. Extração Digital Padrão (Leitura rápida de streams de texto para PDFs gerados por Word/Docs)
 * 3. Fallback Cloud OCR (Para permitir testes em PDFs do Canva diretamente no Expo Go)
 */
export async function extrairTextoCompletoPdf(
  fileUri: string,
  dadosDoArquivo: string | Uint8Array,
  opcoes: OpcoesOcr = {}
): Promise<ResultadoExtracaoPdfCompleta> {
  const { preferirNativo = true, permitirFallbackCloud = true, dpi = 400 } = opcoes;

  // 1. Tentar OCR Nativo no dispositivo (ML Kit / Vision)
  if (preferirNativo && fileUri) {
    try {
      const textoNativo = await extrairTextoViaOcrNativo(fileUri, dpi);
      if (textoNativo && textoNativo.trim().length >= 5) {
        return {
          texto: textoNativo,
          metodo: 'native-ocr',
          origem: 'Google ML Kit / Apple Vision (Nativo no Aparelho)',
        };
      }
    } catch {
      // Segue para a próxima camada
    }
  }

  // 2. Tentar Extração Digital padrão de streams de texto do PDF
  try {
    const textoDigital = await extrairTextoDePdf(dadosDoArquivo);
    if (textoDigital && textoDigital.trim().length >= 5) {
      return {
        texto: textoDigital,
        metodo: 'digital',
        origem: 'Leitor Digital de Fluxo de Texto do PDF',
      };
    }
  } catch {
    // Segue para a próxima camada
  }

  // 3. Fallback: OCR Cloud (Permite que currículos em imagem do Canva funcionem no Expo Go)
  if (permitirFallbackCloud) {
    let base64String = '';
    if (typeof dadosDoArquivo === 'string') {
      base64String = dadosDoArquivo;
    } else {
      // Converte Uint8Array para base64
      let binario = '';
      const len = dadosDoArquivo.byteLength;
      for (let i = 0; i < len; i++) {
        binario += String.fromCharCode(dadosDoArquivo[i]);
      }
      if (typeof btoa === 'function') {
        base64String = btoa(binario);
      }
    }

    if (base64String.length > 0) {
      const textoCloud = await extrairTextoViaOcrCloud(base64String);
      if (textoCloud && textoCloud.trim().length >= 5) {
        return {
          texto: textoCloud,
          metodo: 'cloud-ocr',
          origem: 'OCR Inteligente (Suporte a PDFs do Canva no Expo Go)',
        };
      }
    }
  }

  return {
    texto: '',
    metodo: 'nenhum',
    origem: 'Nenhum texto legível encontrado no arquivo PDF fornecido',
  };
}

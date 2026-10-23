import * as fflate from 'fflate';

/**
 * Utilitário de extração de texto de arquivos PDF em puro JavaScript.
 * Compatível com React Native / Hermes e Web sem dependências nativas ou NodeJS.
 *
 * Suporta:
 * - Streams descomprimidos e comprimidos com FlateDecode (zlib)
 * - Blocos de texto PDF (BT ... ET)
 * - Operadores de texto: Tj, TJ, ', "
 * - Strings literais (...) e escapes (\n, \r, \t, octais \ooo)
 * - Strings hexadecimais <...> (ASCII e UTF-16BE)
 * - Fallback heurístico para arquivos PDF com layouts não-padrão
 */

export function decodificarEscapesPdf(texto: string): string {
  return texto
    .replace(/\\([()\\])/g, '$1')
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t')
    .replace(/\\f/g, '\f')
    .replace(/\\b/g, '\b')
    .replace(/\\([0-7]{1,3})/g, (_, octal: string) => {
      const code = parseInt(octal, 8);
      // Suporte para caracteres comuns em português latin1
      return String.fromCharCode(code);
    });
}

export function decodificarStringHexPdf(hex: string): string {
  const limpo = hex.replace(/\s+/g, '');
  if (!limpo) return '';

  // Verificar se é UTF-16BE (começa com FEFF ou padrão 00xx)
  const bytes: number[] = [];
  for (let i = 0; i < limpo.length; i += 2) {
    const byteHex = limpo.substring(i, i + 2);
    if (byteHex.length === 2) {
      bytes.push(parseInt(byteHex, 16));
    }
  }

  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    // UTF-16BE com BOM
    let str = '';
    for (let i = 2; i < bytes.length; i += 2) {
      if (i + 1 < bytes.length) {
        str += String.fromCharCode((bytes[i] << 8) | bytes[i + 1]);
      }
    }
    return str;
  }

  // Verificar se a cada 2 bytes o primeiro é 0x00 (UTF-16BE comum em fontes PDF)
  if (bytes.length >= 4 && bytes[0] === 0x00 && bytes[2] === 0x00) {
    let str = '';
    for (let i = 0; i < bytes.length; i += 2) {
      if (i + 1 < bytes.length) {
        const charCode = (bytes[i] << 8) | bytes[i + 1];
        if (charCode >= 32 && charCode <= 65535) {
          str += String.fromCharCode(charCode);
        }
      }
    }
    return str;
  }

  // Caso padrão: ASCII / Latin-1 hex
  let resultado = '';
  for (const b of bytes) {
    if (b >= 32 || b === 10 || b === 13) {
      resultado += String.fromCharCode(b);
    }
  }
  return resultado;
}

/**
 * Converte base64 para Uint8Array de forma segura em qualquer runtime.
 */
export function base64ParaBytes(base64: string): Uint8Array {
  // Limpar espaços ou cabeçalhos data:application/pdf;base64, se existirem
  const limpo = base64.replace(/^data:application\/pdf;base64,/, '').replace(/\s+/g, '');
  if (typeof atob === 'function') {
    const binario = atob(limpo);
    const len = binario.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binario.charCodeAt(i) & 0xff;
    }
    return bytes;
  }

  // Fallback puro JS para decodificação base64
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) {
    lookup[chars.charCodeAt(i)] = i;
  }

  let bufferLength = limpo.length * 0.75;
  if (limpo.endsWith('==')) bufferLength -= 2;
  else if (limpo.endsWith('=')) bufferLength -= 1;

  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < limpo.length; i += 4) {
    const enc1 = lookup[limpo.charCodeAt(i)];
    const enc2 = lookup[limpo.charCodeAt(i + 1)];
    const enc3 = lookup[limpo.charCodeAt(i + 2)];
    const enc4 = lookup[limpo.charCodeAt(i + 3)];

    bytes[p++] = (enc1 << 2) | (enc2 >> 4);
    if (p < bufferLength) bytes[p++] = ((enc2 & 15) << 4) | (enc3 >> 2);
    if (p < bufferLength) bytes[p++] = ((enc3 & 3) << 6) | enc4;
  }

  return bytes;
}

/**
 * Extrai texto bruto contido em um PDF a partir de seus bytes ou string binária.
 */
export function extrairTextoDePdf(entrada: string | Uint8Array): string {
  let bytes: Uint8Array;
  if (typeof entrada === 'string') {
    // Se a string contiver cabeçalho %PDF-, é uma string binária latin1
    if (entrada.startsWith('%PDF-') || entrada.includes('%PDF-')) {
      bytes = new Uint8Array(entrada.length);
      for (let i = 0; i < entrada.length; i++) {
        bytes[i] = entrada.charCodeAt(i) & 0xff;
      }
    } else {
      // Caso contrário, é uma string codificada em base64
      bytes = base64ParaBytes(entrada);
    }
  } else {
    bytes = entrada;
  }

  if (!bytes || bytes.length === 0) {
    return '';
  }

  // Converter bytes para string latin1 para busca de marcadores PDF
  let pdfString = '';
  const tamanhoChunk = 8192;
  for (let i = 0; i < bytes.length; i += tamanhoChunk) {
    const pedaco = bytes.subarray(i, i + tamanhoChunk);
    pdfString += String.fromCharCode.apply(null, Array.from(pedaco));
  }

  const linhasExtraidas: string[] = [];

  // 1. Procurar por streams (comprimidos ou descomprimidos)
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(pdfString)) !== null) {
    const rawStream = match[1];
    let decompressed = '';

    // Tentar descomprimir com unzlib (FlateDecode)
    try {
      const streamBytes = new Uint8Array(rawStream.length);
      for (let i = 0; i < rawStream.length; i++) {
        streamBytes[i] = rawStream.charCodeAt(i) & 0xff;
      }
      const uncompressedBytes = fflate.unzlibSync(streamBytes);
      try {
        if (typeof TextDecoder !== 'undefined') {
          decompressed = new TextDecoder('utf-8').decode(uncompressedBytes);
        } else {
          decompressed = String.fromCharCode.apply(null, Array.from(uncompressedBytes));
        }
      } catch {
        decompressed = String.fromCharCode.apply(null, Array.from(uncompressedBytes));
      }
    } catch {
      // Se não estiver comprimido ou der erro, usa a stream original
      decompressed = rawStream;
    }

    // 2. Extrair blocos de texto (BT ... ET)
    const btRegex = /BT[\s\S]*?ET/g;
    let btMatch: RegExpExecArray | null;

    while ((btMatch = btRegex.exec(decompressed)) !== null) {
      const btBlock = btMatch[0];

      // Operador Tj, ' ou ": (texto) Tj
      const tjLiteralRegex = /\((?:\\\(|\\\)|[^)])*\)\s*(?:Tj|'|")/g;
      let tjMatch: RegExpExecArray | null;
      while ((tjMatch = tjLiteralRegex.exec(btBlock)) !== null) {
        let texto = tjMatch[0].replace(/\s*(?:Tj|'|")$/, '');
        texto = texto.slice(1, -1);
        const decodificado = decodificarEscapesPdf(texto).trim();
        if (decodificado.length > 0) {
          linhasExtraidas.push(decodificado);
        }
      }

      // Operador Tj com hexadecimal: <48656c6c6f> Tj
      const tjHexRegex = /<([0-9a-fA-F\s]+)>\s*(?:Tj|'|")/g;
      let tjHexMatch: RegExpExecArray | null;
      while ((tjHexMatch = tjHexRegex.exec(btBlock)) !== null) {
        const hex = tjHexMatch[1];
        const decodificado = decodificarStringHexPdf(hex).trim();
        if (decodificado.length > 0) {
          linhasExtraidas.push(decodificado);
        }
      }

      // Operador TJ com array: [(parte 1) -10 (parte 2)] TJ ou [<hex1> 10 <hex2>] TJ
      const tjArrayRegex = /\[([\s\S]*?)\]\s*TJ/g;
      let arrayMatch: RegExpExecArray | null;
      while ((arrayMatch = tjArrayRegex.exec(btBlock)) !== null) {
        const conteudoArray = arrayMatch[1];
        const partesLinha: string[] = [];

        // Buscar tanto (strings) quanto <hex> dentro do array
        const tokenRegex = /\((?:\\\(|\\\)|[^)])*\)|<([0-9a-fA-F\s]+)>/g;
        let tokenMatch: RegExpExecArray | null;
        while ((tokenMatch = tokenRegex.exec(conteudoArray)) !== null) {
          const item = tokenMatch[0];
          if (item.startsWith('(')) {
            const raw = item.slice(1, -1);
            partesLinha.push(decodificarEscapesPdf(raw));
          } else if (item.startsWith('<')) {
            const hex = tokenMatch[1] || item.slice(1, -1);
            partesLinha.push(decodificarStringHexPdf(hex));
          }
        }

        const linhaMontada = partesLinha.join(' ').replace(/\s+/g, ' ').trim();
        if (linhaMontada.length > 0) {
          linhasExtraidas.push(linhaMontada);
        }
      }
    }
  }

  // Fallback caso não tenha encontrado blocos BT ... ET padrão
  if (linhasExtraidas.length === 0) {
    const parenteseRegex = /\((?:\\\(|\\\)|[^)])*\)/g;
    let pMatch: RegExpExecArray | null;
    while ((pMatch = parenteseRegex.exec(pdfString)) !== null) {
      const conteudo = pMatch[0].slice(1, -1);
      if (conteudo.length >= 3 && /[a-zA-ZÀ-ÿ]/.test(conteudo)) {
        const decod = decodificarEscapesPdf(conteudo).trim();
        if (decod.length > 0 && !decod.includes('%PDF') && !decod.includes('Font')) {
          linhasExtraidas.push(decod);
        }
      }
    }
  }

  // Filtrar e organizar linhas
  const textoFinal = linhasExtraidas
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join('\n');

  return textoFinal;
}

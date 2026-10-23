import * as fflate from 'fflate';

/**
 * Utilitário de extração de texto de PDFs padrão.
 *
 * Suporta:
 * - Streams descomprimidas e comprimidas com FlateDecode (zlib/deflate)
 * - Tabelas /ToUnicode CMaps (beginbfchar e beginbfrange) para fontes subsetadas (Canva, Word, Google Docs)
 * - Operadores de renderização de texto padrão do PDF (BT ... ET, Tj, TJ, ', ")
 * - Strings literais (...) com escapes octais e caracteres especiais
 * - Strings hexadecimais <...> com mapeamento de glifos e UTF-16BE
 * - Proteção estrita contra vazamento de bytes binários de fontes ou imagens embutidas
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
      return String.fromCharCode(code);
    });
}

/**
 * Faz o parsing de tabelas /ToUnicode CMap embutidas no PDF.
 * Mapeia índices de glifos da fonte para caracteres Unicode legíveis.
 */
export function processarCMapToUnicode(cmapStr: string, map: Map<string, string>): void {
  // 1. beginbfchar ... endbfchar: mapeamento direto glifo -> unicode
  // Exemplo: <0001> <004A> ou <0001> <004A006F>
  const bfCharRegex = /beginbfchar([\s\S]*?)endbfchar/g;
  let bfMatch: RegExpExecArray | null;

  while ((bfMatch = bfCharRegex.exec(cmapStr)) !== null) {
    const tokens = bfMatch[1].trim().split(/\s+/).filter(Boolean);
    for (let i = 0; i < tokens.length - 1; i += 2) {
      const srcHex = tokens[i].replace(/[<>]/g, '').toLowerCase();
      const dstHex = tokens[i + 1].replace(/[<>]/g, '');
      let dstStr = '';
      for (let j = 0; j < dstHex.length; j += 4) {
        const charCode = parseInt(dstHex.substring(j, j + 4), 16);
        if (!isNaN(charCode)) {
          dstStr += String.fromCharCode(charCode);
        }
      }
      if (dstStr.length > 0) {
        map.set(srcHex, dstStr);
      }
    }
  }

  // 2. beginbfrange ... endbfrange: intervalos de glifos
  // Exemplo: <0001> <0005> <0041>
  // Exemplo: <0001> <0002> [<0041> <0042>]
  const bfRangeRegex = /beginbfrange([\s\S]*?)endbfrange/g;
  let rgMatch: RegExpExecArray | null;

  while ((rgMatch = bfRangeRegex.exec(cmapStr)) !== null) {
    const tokens = rgMatch[1].trim().split(/\s+/).filter(Boolean);
    let i = 0;
    while (i < tokens.length) {
      const startHex = tokens[i]?.replace(/[<>]/g, '').toLowerCase();
      const endHex = tokens[i + 1]?.replace(/[<>]/g, '').toLowerCase();
      const target = tokens[i + 2];
      if (!startHex || !endHex || !target) break;

      const start = parseInt(startHex, 16);
      const end = parseInt(endHex, 16);
      const hexLen = startHex.length;

      if (target.startsWith('[')) {
        let curr = start;
        let arrIdx = i + 2;
        while (arrIdx < tokens.length && curr <= end) {
          const t = tokens[arrIdx].replace(/[<>[\]]/g, '');
          if (t.length > 0) {
            let s = '';
            for (let j = 0; j < t.length; j += 4) {
              const charCode = parseInt(t.substring(j, j + 4), 16);
              if (!isNaN(charCode)) s += String.fromCharCode(charCode);
            }
            map.set(curr.toString(16).padStart(hexLen, '0').toLowerCase(), s);
            curr++;
          }
          if (tokens[arrIdx].includes(']')) break;
          arrIdx++;
        }
        i = arrIdx + 1;
      } else {
        const targetHex = target.replace(/[<>]/g, '');
        let targetStart = parseInt(targetHex, 16);
        for (let code = start; code <= end; code++) {
          const key = code.toString(16).padStart(hexLen, '0').toLowerCase();
          map.set(key, String.fromCharCode(targetStart));
          targetStart++;
        }
        i += 3;
      }
    }
  }
}

/**
 * Decodifica uma cadeia hexadecimal do PDF utilizando a tabela ToUnicode quando presente,
 * com fallback para UTF-16BE e ASCII padrão.
 */
export function decodificarStringHex(hex: string, cmap?: Map<string, string>): string {
  const limpo = hex.replace(/\s+/g, '').toLowerCase();
  if (!limpo) return '';

  // 1. Tenta decodificar com o mapa ToUnicode da fonte
  if (cmap && cmap.size > 0) {
    let resultado = '';
    let i = 0;
    let encontrouMapeamento = false;

    while (i < limpo.length) {
      // Tenta bloco de 4 caracteres hex (glifos de 2 bytes)
      if (i + 4 <= limpo.length) {
        const pedaco4 = limpo.substring(i, i + 4);
        if (cmap.has(pedaco4)) {
          resultado += cmap.get(pedaco4);
          i += 4;
          encontrouMapeamento = true;
          continue;
        }
      }
      // Tenta bloco de 2 caracteres hex (glifos de 1 byte)
      if (i + 2 <= limpo.length) {
        const pedaco2 = limpo.substring(i, i + 2);
        if (cmap.has(pedaco2)) {
          resultado += cmap.get(pedaco2);
          i += 2;
          encontrouMapeamento = true;
          continue;
        }
      }
      i += 2;
    }

    if (encontrouMapeamento && resultado.length > 0) {
      return resultado;
    }
  }

  // 2. Fallback UTF-16BE com BOM
  if (limpo.startsWith('feff')) {
    let str = '';
    for (let i = 4; i < limpo.length; i += 4) {
      const code = parseInt(limpo.substring(i, i + 4), 16);
      if (!isNaN(code)) str += String.fromCharCode(code);
    }
    return str;
  }

  // 3. Fallback UTF-16BE sem BOM
  const bytes: number[] = [];
  for (let i = 0; i < limpo.length; i += 2) {
    const byteHex = limpo.substring(i, i + 2);
    if (byteHex.length === 2) {
      bytes.push(parseInt(byteHex, 16));
    }
  }

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

  // 4. ASCII / Latin-1 padrão
  let resultadoAscii = '';
  for (const b of bytes) {
    if (b >= 32 || b === 10 || b === 13) {
      resultadoAscii += String.fromCharCode(b);
    }
  }
  return resultadoAscii;
}

export const decodificarStringHexPdf = decodificarStringHex;

/**
 * Decodifica string literal (...) do PDF utilizando ToUnicode ou escapes padrão.
 */
export function decodificarStringLiteral(lit: string, cmap?: Map<string, string>): string {
  // Se houver CMap e a string contiver glifos de 2 bytes não imprimíveis
  if (cmap && cmap.size > 0 && lit.length >= 2) {
    let mapeado = '';
    let encontrouGlifo = false;
    for (let i = 0; i < lit.length; i += 2) {
      const b1 = lit.charCodeAt(i).toString(16).padStart(2, '0');
      const b2 = i + 1 < lit.length ? lit.charCodeAt(i + 1).toString(16).padStart(2, '0') : '';
      const hex = (b1 + b2).toLowerCase();
      if (cmap.has(hex)) {
        mapeado += cmap.get(hex);
        encontrouGlifo = true;
      } else {
        mapeado += lit[i] + (lit[i + 1] || '');
      }
    }
    if (encontrouGlifo && mapeado.length > 0) {
      return mapeado;
    }
  }

  return decodificarEscapesPdf(lit);
}

/**
 * Converte base64 para Uint8Array de forma segura.
 */
export function base64ParaBytes(base64: string): Uint8Array {
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
 * Verifica se um texto possui proporção alta de caracteres válidos e legíveis,
 * descartando ruído binário de fontes compactadas.
 */
function ehLinhaValida(str: string): boolean {
  const t = str.trim();
  if (t.length < 2) return false;
  // Caracteres comuns em currículos (letras com acentos, números, espaços, pontuação)
  const letrasENumeros = t.match(/[a-zA-Z0-9À-ÿ]/g);
  if (!letrasENumeros || letrasENumeros.length < 2) return false;
  const legiveis = t.match(/[a-zA-Z0-9À-ÿ\s.,;:/\-()@+*#%]/g);
  if (!legiveis) return false;
  return legiveis.length / t.length >= 0.7;
}

/**
 * Extrai texto bruto contido em um PDF a partir de seus bytes ou string binária.
 * Processa CMaps ToUnicode e renderiza blocos BT ... ET de forma padrão.
 */
export async function extrairTextoDePdf(entrada: string | Uint8Array): Promise<string> {
  let bytes: Uint8Array;
  if (typeof entrada === 'string') {
    if (entrada.startsWith('%PDF-') || entrada.includes('%PDF-')) {
      bytes = new Uint8Array(entrada.length);
      for (let i = 0; i < entrada.length; i++) {
        bytes[i] = entrada.charCodeAt(i) & 0xff;
      }
    } else {
      bytes = base64ParaBytes(entrada);
    }
  } else {
    bytes = entrada;
  }

  if (!bytes || bytes.length === 0) {
    return '';
  }

  // Converter bytes para string binária (latin1)
  let pdfString = '';
  const tamanhoChunk = 8192;
  for (let i = 0; i < bytes.length; i += tamanhoChunk) {
    const pedaco = bytes.subarray(i, i + tamanhoChunk);
    pdfString += String.fromCharCode.apply(null, Array.from(pedaco));
  }

  // 1. Localizar streams e mapear tabelas /ToUnicode
  const cmapMap = new Map<string, string>();
  const streamRegex = /(?:<<([\s\S]*?)>>\s*)?stream\r?\n([\s\S]*?)\r?\n?endstream/g;
  let match: RegExpExecArray | null;

  const streamsDeConteudo: string[] = [];

  while ((match = streamRegex.exec(pdfString)) !== null) {
    const headerDict = match[1] || '';
    const rawStream = match[2];

    // Ignorar streams binárias de fontes, imagens e tabelas de índice
    if (
      headerDict.includes('/FontFile') ||
      headerDict.includes('/Subtype /Image') ||
      headerDict.includes('/Subtype/Image') ||
      headerDict.includes('/Filter /DCTDecode') ||
      headerDict.includes('/Filter/DCTDecode') ||
      headerDict.includes('/Type /ObjStm') ||
      headerDict.includes('/Type/ObjStm') ||
      headerDict.includes('/Type /XRef')
    ) {
      continue;
    }

    let decompressed = '';
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
      // Tentar descompressão raw inflate se zlib falhar
      try {
        const streamBytes = new Uint8Array(rawStream.length);
        for (let i = 0; i < rawStream.length; i++) {
          streamBytes[i] = rawStream.charCodeAt(i) & 0xff;
        }
        const uncompressedBytes = fflate.inflateSync(streamBytes);
        decompressed = String.fromCharCode.apply(null, Array.from(uncompressedBytes));
      } catch {
        decompressed = rawStream;
      }
    }

    // Se for uma tabela ToUnicode, processa os mapeamentos de glifos
    if (
      decompressed.includes('begincmap') ||
      decompressed.includes('beginbfchar') ||
      decompressed.includes('beginbfrange')
    ) {
      processarCMapToUnicode(decompressed, cmapMap);
    } else if (decompressed.includes('BT') && decompressed.includes('ET')) {
      streamsDeConteudo.push(decompressed);
    }
  }

  // 2. Extrair blocos de texto BT ... ET dos fluxos de página
  const linhasExtraidas: string[] = [];

  for (const streamConteudo of streamsDeConteudo) {
    const btRegex = /BT[\s\S]*?ET/g;
    let btMatch: RegExpExecArray | null;

    while ((btMatch = btRegex.exec(streamConteudo)) !== null) {
      const btBlock = btMatch[0];
      const blocoPartes: string[] = [];

      // Identifica comandos Tj, ', " e TJ
      const opRegex =
        /\((?:\\\(|\\\)|[^)])*\)\s*(?:Tj|'|")|<([0-9a-fA-F\s]+)>\s*(?:Tj|'|")|\[([\s\S]*?)\]\s*TJ/g;
      let opMatch: RegExpExecArray | null;

      while ((opMatch = opRegex.exec(btBlock)) !== null) {
        const full = opMatch[0];

        // 1. Literal: (texto) Tj
        if (full.startsWith('(')) {
          const raw = full.slice(1, full.lastIndexOf(')'));
          const dec = decodificarStringLiteral(raw, cmapMap).trim();
          if (dec.length > 0) blocoPartes.push(dec);
        }
        // 2. Hexadecimal: <hex> Tj
        else if (full.startsWith('<')) {
          const hex = opMatch[1];
          const dec = decodificarStringHex(hex, cmapMap).trim();
          if (dec.length > 0) blocoPartes.push(dec);
        }
        // 3. Array com espaçamento: [(...) 10 <...>] TJ
        else if (full.startsWith('[')) {
          const arrayConteudo = opMatch[2];
          const tokenRegex = /\((?:\\\(|\\\)|[^)])*\)|<([0-9a-fA-F\s]+)>/g;
          let tokMatch: RegExpExecArray | null;
          const linhaPartes: string[] = [];

          while ((tokMatch = tokenRegex.exec(arrayConteudo)) !== null) {
            const tok = tokMatch[0];
            if (tok.startsWith('(')) {
              const raw = tok.slice(1, -1);
              const dec = decodificarStringLiteral(raw, cmapMap);
              if (dec) linhaPartes.push(dec);
            } else if (tok.startsWith('<')) {
              const hex = tokMatch[1] || tok.slice(1, -1);
              const dec = decodificarStringHex(hex, cmapMap);
              if (dec) linhaPartes.push(dec);
            }
          }

          const montada = linhaPartes.join(' ').replace(/\s+/g, ' ').trim();
          if (montada.length > 0) {
            blocoPartes.push(montada);
          }
        }
      }

      const linhaFinal = blocoPartes.join(' ').replace(/\s+/g, ' ').trim();
      if (linhaFinal.length > 0 && ehLinhaValida(linhaFinal)) {
        linhasExtraidas.push(linhaFinal);
      }
    }
  }

  return linhasExtraidas.join('\n');
}

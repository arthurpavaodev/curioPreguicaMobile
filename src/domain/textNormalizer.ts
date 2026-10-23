export function normalizarTexto(texto: string): string {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
}

export function contemTermo(textoNormalizado: string, termoNormalizado: string): boolean {
  if (!textoNormalizado || !termoNormalizado) return false;
  const regex = new RegExp('(^|[^a-z0-9])' + escaparRegex(termoNormalizado) + '([^a-z0-9]|$)');
  return regex.test(textoNormalizado);
}

export function removerTermo(textoNormalizado: string, termoNormalizado: string): string {
  if (!textoNormalizado || !termoNormalizado) return textoNormalizado;
  const regex = new RegExp('(^|[^a-z0-9])' + escaparRegex(termoNormalizado) + '([^a-z0-9]|$)', 'g');
  return textoNormalizado.replace(regex, '$1 $2');
}

export interface LeitorDeArquivoDeCurriculo {
  escolherEler(): Promise<string | null>;
}

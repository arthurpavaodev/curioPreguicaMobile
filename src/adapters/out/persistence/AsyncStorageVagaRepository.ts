import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vaga } from '../../../domain';
import { VagaRepository } from '../../../application';
import { VAGAS_EXEMPLO } from '../seed/SeedData';

const STORAGE_KEY = '@plano_de_voo:vagas_personalizadas';

export class AsyncStorageVagaRepository implements VagaRepository {
  async listarExemplos(): Promise<Vaga[]> {
    return [...VAGAS_EXEMPLO];
  }

  async listarPersonalizadas(): Promise<Vaga[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      return JSON.parse(data) as Vaga[];
    } catch {
      return [];
    }
  }

  async adicionar(vaga: Vaga): Promise<void> {
    const atuais = await this.listarPersonalizadas();
    atuais.unshift(vaga);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(atuais));
  }

  async remover(id: string): Promise<void> {
    const atuais = await this.listarPersonalizadas();
    const filtradas = atuais.filter((v) => v.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtradas));
  }

  async obterPorId(id: string): Promise<Vaga | null> {
    const exemplo = VAGAS_EXEMPLO.find((v) => v.id === id);
    if (exemplo) return exemplo;

    const personalizadas = await this.listarPersonalizadas();
    return personalizadas.find((v) => v.id === id) || null;
  }
}

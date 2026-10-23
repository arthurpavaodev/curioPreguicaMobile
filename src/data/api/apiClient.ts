import { Curriculo, Vaga, Aluno } from '../../domain';
import { getApiBaseUrl } from './apiConfig';

export const apiClient = {
  async listarVagas(): Promise<Vaga[] | null> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/vagas`);
      if (!res.ok) return null;
      return (await res.json()) as Vaga[];
    } catch {
      return null;
    }
  },

  async criarVaga(vaga: Vaga): Promise<Vaga | null> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/vagas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vaga),
      });
      if (!res.ok) return null;
      return (await res.json()) as Vaga;
    } catch {
      return null;
    }
  },

  async removerVaga(id: string): Promise<boolean> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/vagas/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async obterCurriculo(): Promise<Curriculo | null> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/curriculo`);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data || !data.texto) return null;
      return data as Curriculo;
    } catch {
      return null;
    }
  },

  async salvarCurriculo(curriculo: Curriculo): Promise<boolean> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/curriculo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curriculo),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async obterProgressoPlano(): Promise<Record<string, boolean> | null> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/plano-voo`);
      if (!res.ok) return null;
      return (await res.json()) as Record<string, boolean>;
    } catch {
      return null;
    }
  },

  async atualizarProgressoPlano(etapaId: string, concluida: boolean): Promise<Record<string, boolean> | null> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/plano-voo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapaId, concluida }),
      });
      if (!res.ok) return null;
      return (await res.json()) as Record<string, boolean>;
    } catch {
      return null;
    }
  },

  async listarAlunos(): Promise<Aluno[] | null> {
    try {
      const baseUrl = await getApiBaseUrl();
      const res = await fetch(`${baseUrl}/api/alunos`);
      if (!res.ok) return null;
      return (await res.json()) as Aluno[];
    } catch {
      return null;
    }
  },
};

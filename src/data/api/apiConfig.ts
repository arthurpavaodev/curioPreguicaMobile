import { localStorageService } from '../storage/localStorage';

export const VPS_API_KEY = '@plano_de_voo:vps_api_url';

// URL padrão: caso queira fixar ou ler do process.env
export const DEFAULT_API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export async function getApiBaseUrl(): Promise<string> {
  const custom = await localStorageService.getString(VPS_API_KEY);
  if (custom && custom.trim().length > 0) {
    return custom.trim().replace(/\/+$/, '');
  }
  return DEFAULT_API_URL.replace(/\/+$/, '');
}

export async function setApiBaseUrl(url: string | null): Promise<void> {
  await localStorageService.setString(VPS_API_KEY, url?.trim() || null);
}

export async function checkServerHealth(baseUrl?: string): Promise<{
  online: boolean;
  database?: string;
  error?: string;
}> {
  try {
    const url = baseUrl || (await getApiBaseUrl());
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(`${url}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      return { online: true, database: data.database };
    }
    return { online: false, error: `HTTP ${res.status}` };
  } catch (err) {
    return { online: false, error: (err as Error).message || 'Timeout/Inacessível' };
  }
}

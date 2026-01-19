import type {
  TimeEntryRow,
  ImportRequest,
  ImportResult,
  HarvestProject,
  TogglWorkspace,
  TogglProject,
  StatusResponse,
} from '../types';

const API_BASE = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  getStatus: () => fetchJson<StatusResponse>('/status'),

  getHarvestEntries: (from: string, to: string) =>
    fetchJson<TimeEntryRow[]>(`/harvest/entries?from=${from}&to=${to}`),

  getHarvestProjects: () => fetchJson<HarvestProject[]>('/harvest/projects'),

  getTogglWorkspaces: () => fetchJson<TogglWorkspace[]>('/toggl/workspaces'),

  getTogglProjects: (workspaceId: number) =>
    fetchJson<TogglProject[]>(`/toggl/projects?workspaceId=${workspaceId}`),

  importToToggl: (request: ImportRequest) =>
    fetchJson<ImportResult[]>('/toggl/import', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};

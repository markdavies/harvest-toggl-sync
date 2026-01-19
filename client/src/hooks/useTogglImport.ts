import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../services/api';
import type { ImportRequest } from '../types';

export function useTogglWorkspaces() {
  return useQuery({
    queryKey: ['togglWorkspaces'],
    queryFn: api.getTogglWorkspaces,
  });
}

export function useTogglProjects(workspaceId: number | null) {
  return useQuery({
    queryKey: ['togglProjects', workspaceId],
    queryFn: () => api.getTogglProjects(workspaceId!),
    enabled: workspaceId !== null,
  });
}

export function useTogglImport() {
  return useMutation({
    mutationFn: (request: ImportRequest) => api.importToToggl(request),
  });
}

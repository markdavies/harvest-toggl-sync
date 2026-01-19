import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

export function useHarvestEntries(from: string, to: string, enabled: boolean) {
  return useQuery({
    queryKey: ['harvestEntries', from, to],
    queryFn: () => api.getHarvestEntries(from, to),
    enabled: enabled && Boolean(from && to),
  });
}

export function useHarvestProjects() {
  return useQuery({
    queryKey: ['harvestProjects'],
    queryFn: api.getHarvestProjects,
  });
}

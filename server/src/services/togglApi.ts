import { env } from '../config/env.js';
import type { TimeEntryRow, ImportResult, TogglWorkspace, TogglProject } from '../../../shared/types.js';

const BASE_URL = 'https://api.track.toggl.com/api/v9';
const RATE_LIMIT_DELAY = 1000; // 1 second between POST requests

interface TogglTimeEntry {
  id: number;
  description: string;
  start: string;
  duration: number;
  project_id: number | null;
}

function getAuthHeader(): string {
  const credentials = Buffer.from(`${env.TOGGL_API_TOKEN}:api_token`).toString('base64');
  return `Basic ${credentials}`;
}

async function togglFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Toggl API error: ${response.status} ${text}`);
  }

  return response.json();
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getWorkspaces(): Promise<TogglWorkspace[]> {
  const workspaces = await togglFetch<Array<{ id: number; name: string }>>('/workspaces');
  return workspaces.map(w => ({ id: w.id, name: w.name }));
}

export async function getProjects(workspaceId: number): Promise<TogglProject[]> {
  const projects = await togglFetch<Array<{ id: number; name: string; workspace_id: number }> | null>(
    `/workspaces/${workspaceId}/projects`
  );

  if (!projects) return [];

  return projects.map(p => ({
    id: p.id,
    name: p.name,
    workspaceId: p.workspace_id,
  }));
}

async function getExistingEntries(
  workspaceId: number,
  startDate: string,
  endDate: string
): Promise<TogglTimeEntry[]> {
  const response = await togglFetch<TogglTimeEntry[]>(
    `/me/time_entries?start_date=${startDate}&end_date=${endDate}`
  );
  return response || [];
}

function isDuplicate(
  entry: TimeEntryRow,
  existingEntries: TogglTimeEntry[]
): boolean {
  return existingEntries.some(existing => {
    const existingDate = existing.start.split('T')[0];
    const sameDate = existingDate === entry.date;
    const sameDescription = existing.description === entry.description;
    const sameDuration = Math.abs(existing.duration - entry.hours * 3600) < 60; // within 1 minute
    return sameDate && sameDescription && sameDuration;
  });
}

export async function importEntries(
  entries: TimeEntryRow[],
  workspaceId: number,
  projectMapping: Record<string, number>
): Promise<ImportResult[]> {
  const results: ImportResult[] = [];

  // Get date range for duplicate check
  const dates = entries.map(e => e.date).sort();
  const startDate = dates[0];
  const endDate = dates[dates.length - 1];

  // Fetch existing entries for duplicate detection
  const existingEntries = await getExistingEntries(workspaceId, startDate, endDate);

  for (const entry of entries) {
    try {
      // Check for duplicates
      if (isDuplicate(entry, existingEntries)) {
        results.push({
          entry,
          success: false,
          error: 'Duplicate entry detected',
        });
        continue;
      }

      const projectId = projectMapping[entry.project];

      // Convert date and hours to Toggl format
      const startTime = new Date(`${entry.date}T09:00:00`);
      const durationSeconds = Math.round(entry.hours * 3600);

      const togglEntry = await togglFetch<{ id: number }>(
        `/workspaces/${workspaceId}/time_entries`,
        {
          method: 'POST',
          body: JSON.stringify({
            description: entry.description,
            start: startTime.toISOString(),
            duration: durationSeconds,
            project_id: projectId || null,
            workspace_id: workspaceId,
            created_with: 'harvest-toggl-sync',
            billable: entry.billable,
            tags: [entry.task],
          }),
        }
      );

      results.push({
        entry,
        success: true,
        togglId: togglEntry.id,
      });

      // Rate limiting between POSTs
      await delay(RATE_LIMIT_DELAY);
    } catch (error) {
      results.push({
        entry,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  return results;
}

import { env } from '../config/env.js';
import type { TimeEntryRow, HarvestProject } from '../../../shared/types.js';

const BASE_URL = 'https://api.harvestapp.com/v2';
const RATE_LIMIT_DELAY = 150; // ms between requests

interface HarvestTimeEntry {
  id: number;
  spent_date: string;
  hours: number;
  notes: string | null;
  billable: boolean;
  client: { id: number; name: string };
  project: { id: number; name: string };
  task: { id: number; name: string };
}

interface HarvestProjectAssignment {
  id: number;
  project: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    name: string;
  };
}

interface PaginatedResponse<T> {
  [key: string]: T[] | number | string | null;
  page: number;
  total_pages: number;
  next_page: number | null;
}

async function harvestFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${env.HARVEST_ACCESS_TOKEN}`,
      'Harvest-Account-Id': env.HARVEST_ACCOUNT_ID,
      'User-Agent': 'Harvest-Toggl-Sync',
    },
  });

  if (!response.ok) {
    throw new Error(`Harvest API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getTimeEntries(from: string, to: string): Promise<TimeEntryRow[]> {
  const entries: TimeEntryRow[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await harvestFetch<PaginatedResponse<HarvestTimeEntry>>('/time_entries', {
      from,
      to,
      page: page.toString(),
      per_page: '100',
    });

    const timeEntries = response.time_entries as HarvestTimeEntry[];
    totalPages = response.total_pages as number;

    for (const entry of timeEntries) {
      entries.push({
        id: crypto.randomUUID(),
        harvestId: entry.id,
        date: entry.spent_date,
        client: entry.client.name,
        project: entry.project.name,
        task: entry.task.name,
        description: entry.notes || '',
        hours: entry.hours,
        billable: entry.billable,
      });
    }

    page++;
    if (page <= totalPages) {
      await delay(RATE_LIMIT_DELAY);
    }
  }

  return entries;
}

export async function getProjects(): Promise<HarvestProject[]> {
  const projects: HarvestProject[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await harvestFetch<PaginatedResponse<HarvestProjectAssignment>>('/users/me/project_assignments', {
      page: page.toString(),
      per_page: '100',
    });

    const assignments = response.project_assignments as HarvestProjectAssignment[];
    totalPages = response.total_pages as number;

    for (const assignment of assignments) {
      projects.push({
        id: assignment.project.id,
        name: assignment.project.name,
        clientName: assignment.client.name,
      });
    }

    page++;
    if (page <= totalPages) {
      await delay(RATE_LIMIT_DELAY);
    }
  }

  return projects;
}

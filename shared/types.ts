// Unified time entry for the UI
export interface TimeEntryRow {
  id: string;                    // UUID for UI tracking
  harvestId?: number;            // Original Harvest ID
  date: string;                  // YYYY-MM-DD
  client: string;
  project: string;
  task: string;
  description: string;
  hours: number;
  billable: boolean;
  isNew?: boolean;               // Added manually
  isModified?: boolean;          // Edited after import
}

export interface ImportRequest {
  entries: TimeEntryRow[];
  workspaceId: number;
  projectMapping: Record<string, number>;  // Harvest project → Toggl project ID
}

export interface ImportResult {
  entry: TimeEntryRow;
  success: boolean;
  togglId?: number;
  error?: string;
}

export interface HarvestProject {
  id: number;
  name: string;
  clientName: string;
}

export interface TogglWorkspace {
  id: number;
  name: string;
}

export interface TogglProject {
  id: number;
  name: string;
  workspaceId: number;
}

export interface StatusResponse {
  harvestConfigured: boolean;
  togglConfigured: boolean;
}

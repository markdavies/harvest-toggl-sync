import { useState, useMemo } from 'react';
import type { TimeEntryRow, TogglWorkspace, TogglProject, ImportResult } from '../types';

interface ImportButtonProps {
  entries: TimeEntryRow[];
  workspaces: TogglWorkspace[];
  projects: TogglProject[];
  selectedWorkspaceId: number | null;
  onWorkspaceChange: (id: number | null) => void;
  onImport: (projectMapping: Record<string, number>) => void;
  isImporting: boolean;
  results: ImportResult[] | null;
}

export function ImportButton({
  entries,
  workspaces,
  projects,
  selectedWorkspaceId,
  onWorkspaceChange,
  onImport,
  isImporting,
  results,
}: ImportButtonProps) {
  const [projectMapping, setProjectMapping] = useState<Record<string, number>>({});
  const [showMapping, setShowMapping] = useState(false);

  // Get unique Harvest project names
  const harvestProjects = useMemo(() => {
    const projectSet = new Set(entries.map((e) => e.project));
    return Array.from(projectSet).sort();
  }, [entries]);

  const handleImport = () => {
    onImport(projectMapping);
  };

  const successCount = results?.filter((r) => r.success).length || 0;
  const errorCount = results?.filter((r) => !r.success).length || 0;

  return (
    <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-semibold text-gray-800">Import to Toggl</h3>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Workspace:</label>
        <select
          value={selectedWorkspaceId || ''}
          onChange={(e) => onWorkspaceChange(e.target.value ? Number(e.target.value) : null)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select workspace...</option>
          {workspaces.map((ws) => (
            <option key={ws.id} value={ws.id}>
              {ws.name}
            </option>
          ))}
        </select>
      </div>

      {selectedWorkspaceId && harvestProjects.length > 0 && (
        <div>
          <button
            onClick={() => setShowMapping(!showMapping)}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            {showMapping ? 'Hide' : 'Show'} Project Mapping ({harvestProjects.length} projects)
          </button>

          {showMapping && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
              {harvestProjects.map((harvestProject) => (
                <div key={harvestProject} className="flex items-center gap-3">
                  <span className="text-sm text-gray-700 w-48 truncate" title={harvestProject}>
                    {harvestProject}
                  </span>
                  <span className="text-gray-400">&rarr;</span>
                  <select
                    value={projectMapping[harvestProject] || ''}
                    onChange={(e) =>
                      setProjectMapping({
                        ...projectMapping,
                        [harvestProject]: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">No project (unassigned)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleImport}
          disabled={!selectedWorkspaceId || entries.length === 0 || isImporting}
          className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isImporting ? 'Importing...' : `Import ${entries.length} Entries`}
        </button>

        {results && (
          <div className="text-sm">
            <span className="text-green-600">{successCount} succeeded</span>
            {errorCount > 0 && (
              <span className="text-red-600 ml-2">{errorCount} failed</span>
            )}
          </div>
        )}
      </div>

      {results && errorCount > 0 && (
        <div className="mt-2 text-sm text-red-600 max-h-32 overflow-y-auto">
          {results
            .filter((r) => !r.success)
            .map((r, i) => (
              <div key={i}>
                {r.entry.date} - {r.entry.description.slice(0, 30)}: {r.error}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

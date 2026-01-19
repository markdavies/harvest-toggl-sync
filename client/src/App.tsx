import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from './services/api';
import { useHarvestEntries } from './hooks/useHarvestEntries';
import { useTogglWorkspaces, useTogglProjects, useTogglImport } from './hooks/useTogglImport';
import { ErrorBanner } from './components/ErrorBanner';
import { DateRangePicker } from './components/DateRangePicker';
import { TimeEntryTable } from './components/TimeEntryTable';
import { ImportButton } from './components/ImportButton';
import type { TimeEntryRow, ImportResult } from './types';

function getDefaultDates() {
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const format = (d: Date) => d.toISOString().split('T')[0];
  return { from: format(weekAgo), to: format(today) };
}

export default function App() {
  const [fromDate, setFromDate] = useState(getDefaultDates().from);
  const [toDate, setToDate] = useState(getDefaultDates().to);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [entries, setEntries] = useState<TimeEntryRow[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const [importResults, setImportResults] = useState<ImportResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const statusQuery = useQuery({
    queryKey: ['status'],
    queryFn: api.getStatus,
  });

  const harvestQuery = useHarvestEntries(fromDate, toDate, shouldFetch);
  const workspacesQuery = useTogglWorkspaces();
  const projectsQuery = useTogglProjects(selectedWorkspaceId);
  const importMutation = useTogglImport();

  // Sync fetched entries to local state
  useEffect(() => {
    if (harvestQuery.data) {
      setEntries(harvestQuery.data);
      setShouldFetch(false);
      setImportResults(null);
    }
  }, [harvestQuery.data]);

  // Handle fetch errors
  useEffect(() => {
    if (harvestQuery.error) {
      setError(harvestQuery.error.message);
      setShouldFetch(false);
    }
  }, [harvestQuery.error]);

  const handleFetch = () => {
    setError(null);
    setShouldFetch(true);
  };

  const handleUpdateEntry = (updated: TimeEntryRow) => {
    setEntries(entries.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const handleAddEntry = () => {
    const newEntry: TimeEntryRow = {
      id: crypto.randomUUID(),
      date: toDate,
      client: '',
      project: '',
      task: '',
      description: '',
      hours: 0,
      billable: true,
      isNew: true,
    };
    setEntries([...entries, newEntry]);
  };

  const handleImport = (projectMapping: Record<string, number>) => {
    if (!selectedWorkspaceId) return;

    setError(null);
    setImportResults(null);

    importMutation.mutate(
      {
        entries,
        workspaceId: selectedWorkspaceId,
        projectMapping,
      },
      {
        onSuccess: (results) => {
          setImportResults(results);
        },
        onError: (err) => {
          setError(err.message);
        },
      }
    );
  };

  const isConfigured =
    statusQuery.data?.harvestConfigured && statusQuery.data?.togglConfigured;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Harvest to Toggl Sync</h1>
          <p className="text-sm text-gray-600 mt-1">
            Export time entries from Harvest, edit them, and import to Toggl
          </p>
        </header>

        {statusQuery.isLoading ? (
          <div className="text-gray-500">Checking configuration...</div>
        ) : !isConfigured ? (
          <ErrorBanner
            message={`Missing API credentials. Please configure ${
              !statusQuery.data?.harvestConfigured ? 'Harvest' : ''
            }${!statusQuery.data?.harvestConfigured && !statusQuery.data?.togglConfigured ? ' and ' : ''}${
              !statusQuery.data?.togglConfigured ? 'Toggl' : ''
            } in your .env file.`}
          />
        ) : null}

        {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <DateRangePicker
            from={fromDate}
            to={toDate}
            onFromChange={setFromDate}
            onToChange={setToDate}
            onFetch={handleFetch}
            isLoading={harvestQuery.isFetching}
          />

          <TimeEntryTable
            entries={entries}
            onUpdate={handleUpdateEntry}
            onDelete={handleDeleteEntry}
            onAdd={handleAddEntry}
          />

          {entries.length > 0 && (
            <ImportButton
              entries={entries}
              workspaces={workspacesQuery.data || []}
              projects={projectsQuery.data || []}
              selectedWorkspaceId={selectedWorkspaceId}
              onWorkspaceChange={setSelectedWorkspaceId}
              onImport={handleImport}
              isImporting={importMutation.isPending}
              results={importResults}
            />
          )}
        </div>
      </div>
    </div>
  );
}

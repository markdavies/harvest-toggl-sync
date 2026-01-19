import type { TimeEntryRow } from '../types';
import { TableRow } from './TableRow';

interface TimeEntryTableProps {
  entries: TimeEntryRow[];
  onUpdate: (entry: TimeEntryRow) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function TimeEntryTable({ entries, onUpdate, onDelete, onAdd }: TimeEntryTableProps) {
  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {entries.length} entries | Total: {totalHours.toFixed(2)} hours
        </div>
        <button
          onClick={onAdd}
          className="bg-green-600 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-green-700"
        >
          + Add Row
        </button>
      </div>

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b">Client</th>
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b">Project</th>
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b">Task</th>
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-700 border-b">Description</th>
            <th className="px-3 py-2 text-right text-sm font-semibold text-gray-700 border-b">Hours</th>
            <th className="px-3 py-2 text-center text-sm font-semibold text-gray-700 border-b">Billable</th>
            <th className="px-3 py-2 text-sm font-semibold text-gray-700 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-3 py-8 text-center text-gray-500">
                No entries. Fetch from Harvest or add a new row.
              </td>
            </tr>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry.id}
                entry={entry}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))
          )}
        </tbody>
      </table>

      <p className="text-xs text-gray-500 mt-2">
        Double-click a row to edit. Green = new row, Yellow = modified.
      </p>
    </div>
  );
}

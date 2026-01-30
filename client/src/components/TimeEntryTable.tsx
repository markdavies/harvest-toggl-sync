import { useState } from 'react';
import type { TimeEntryRow } from '../types';
import { TableRow } from './TableRow';

type BulkField = 'date' | 'client' | 'project' | 'task' | 'description' | 'hours' | 'billable';

interface TimeEntryTableProps {
  entries: TimeEntryRow[];
  onUpdate: (entry: TimeEntryRow) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onBulkUpdate: (ids: Set<string>, field: BulkField, value: string | number | boolean) => void;
  onBulkDelete: (ids: Set<string>) => void;
}

export function TimeEntryTable({ entries, onUpdate, onDelete, onAdd, onBulkUpdate, onBulkDelete }: TimeEntryTableProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkField, setBulkField] = useState<BulkField>('date');
  const [bulkValue, setBulkValue] = useState('');

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0);

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(entries.map((e) => e.id)) : new Set());
  };

  const allSelected = entries.length > 0 && selectedIds.size === entries.length;

  const handleBulkApply = () => {
    let parsedValue: string | number | boolean = bulkValue;
    if (bulkField === 'hours') parsedValue = parseFloat(bulkValue) || 0;
    else if (bulkField === 'billable') parsedValue = bulkValue === 'true';
    onBulkUpdate(selectedIds, bulkField, parsedValue);
    setSelectedIds(new Set());
    setBulkValue('');
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedIds);
    setSelectedIds(new Set());
  };

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

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-sm font-medium text-blue-800">{selectedIds.size} selected</span>
          <select
            value={bulkField}
            onChange={(e) => { setBulkField(e.target.value as BulkField); setBulkValue(''); }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="date">Date</option>
            <option value="client">Client</option>
            <option value="project">Project</option>
            <option value="task">Task</option>
            <option value="description">Description</option>
            <option value="hours">Hours</option>
            <option value="billable">Billable</option>
          </select>
          {bulkField === 'billable' ? (
            <select key="billable" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="">--</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : bulkField === 'date' ? (
            <input key="date" type="date" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="border rounded px-2 py-1 text-sm" />
          ) : bulkField === 'hours' ? (
            <input key="hours" type="number" step="0.25" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} className="border rounded px-2 py-1 text-sm w-24" />
          ) : (
            <input key={bulkField} type="text" value={bulkValue} onChange={(e) => setBulkValue(e.target.value)} placeholder={`New ${bulkField}`} className="border rounded px-2 py-1 text-sm" />
          )}
          <button onClick={handleBulkApply} disabled={!bulkValue} className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
            Apply
          </button>
          <button onClick={handleBulkDelete} className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium hover:bg-red-700">
            Delete Selected
          </button>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-2 border-b">
              <input type="checkbox" checked={allSelected} onChange={(e) => handleSelectAll(e.target.checked)} className="w-4 h-4" />
            </th>
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
              <td colSpan={9} className="px-3 py-8 text-center text-gray-500">
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
                selected={selectedIds.has(entry.id)}
                onSelect={handleSelect}
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

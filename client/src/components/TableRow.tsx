import { useState, useRef, useEffect } from 'react';
import type { TimeEntryRow } from '../types';

interface TableRowProps {
  entry: TimeEntryRow;
  onUpdate: (entry: TimeEntryRow) => void;
  onDelete: (id: string) => void;
}

export function TableRow({ entry, onUpdate, onDelete }: TableRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(entry);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setIsEditing(true);
    setEditData(entry);
  };

  const handleSave = () => {
    onUpdate({ ...editData, isModified: true });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditData(entry);
    }
  };

  const rowClass = `${entry.isNew ? 'bg-green-50' : ''} ${entry.isModified ? 'bg-yellow-50' : ''} hover:bg-gray-50`;

  if (isEditing) {
    return (
      <tr className={rowClass}>
        <td className="px-3 py-2 border-b">
          <input
            ref={inputRef}
            type="date"
            value={editData.date}
            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </td>
        <td className="px-3 py-2 border-b">
          <input
            type="text"
            value={editData.client}
            onChange={(e) => setEditData({ ...editData, client: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </td>
        <td className="px-3 py-2 border-b">
          <input
            type="text"
            value={editData.project}
            onChange={(e) => setEditData({ ...editData, project: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </td>
        <td className="px-3 py-2 border-b">
          <input
            type="text"
            value={editData.task}
            onChange={(e) => setEditData({ ...editData, task: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </td>
        <td className="px-3 py-2 border-b">
          <input
            type="text"
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            onKeyDown={handleKeyDown}
            className="w-full border rounded px-2 py-1 text-sm"
          />
        </td>
        <td className="px-3 py-2 border-b">
          <input
            type="number"
            step="0.25"
            value={editData.hours}
            onChange={(e) => setEditData({ ...editData, hours: parseFloat(e.target.value) || 0 })}
            onKeyDown={handleKeyDown}
            className="w-20 border rounded px-2 py-1 text-sm"
          />
        </td>
        <td className="px-3 py-2 border-b text-center">
          <input
            type="checkbox"
            checked={editData.billable}
            onChange={(e) => setEditData({ ...editData, billable: e.target.checked })}
            className="w-4 h-4"
          />
        </td>
        <td className="px-3 py-2 border-b">
          <div className="flex gap-1">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-800 text-sm font-medium"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setEditData(entry);
              }}
              className="text-gray-600 hover:text-gray-800 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={rowClass} onDoubleClick={handleDoubleClick}>
      <td className="px-3 py-2 border-b text-sm">{entry.date}</td>
      <td className="px-3 py-2 border-b text-sm">{entry.client}</td>
      <td className="px-3 py-2 border-b text-sm">{entry.project}</td>
      <td className="px-3 py-2 border-b text-sm">{entry.task}</td>
      <td className="px-3 py-2 border-b text-sm max-w-xs truncate" title={entry.description}>
        {entry.description}
      </td>
      <td className="px-3 py-2 border-b text-sm text-right">{entry.hours.toFixed(2)}</td>
      <td className="px-3 py-2 border-b text-center">
        {entry.billable ? (
          <span className="text-green-600">Yes</span>
        ) : (
          <span className="text-gray-400">No</span>
        )}
      </td>
      <td className="px-3 py-2 border-b">
        <button
          onClick={() => onDelete(entry.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  onFetch,
  isLoading,
}: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <label htmlFor="from" className="text-sm font-medium text-gray-700">
          From:
        </label>
        <input
          type="date"
          id="from"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="to" className="text-sm font-medium text-gray-700">
          To:
        </label>
        <input
          type="date"
          id="to"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        onClick={onFetch}
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Loading...' : 'Fetch Entries'}
      </button>
    </div>
  );
}

interface DateRangePickerProps {
  from: string;
  to: string;
  onFromChange: (date: string) => void;
  onToChange: (date: string) => void;
  onFetch: () => void;
  isLoading: boolean;
  clientNames?: string[];
  clientFilter?: string;
  onClientFilterChange?: (client: string) => void;
}

export function DateRangePicker({
  from,
  to,
  onFromChange,
  onToChange,
  onFetch,
  isLoading,
  clientNames = [],
  clientFilter = '',
  onClientFilterChange,
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
      {clientNames.length > 0 && onClientFilterChange && (
        <div className="flex items-center gap-2">
          <label htmlFor="client-filter" className="text-sm font-medium text-gray-700">
            Client:
          </label>
          <select
            id="client-filter"
            value={clientFilter}
            onChange={(e) => onClientFilterChange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Clients</option>
            {clientNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}
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

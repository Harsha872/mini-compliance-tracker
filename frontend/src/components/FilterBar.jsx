import React from 'react';

function FilterBar({ filters, onFilterChange, categories }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">Status</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-xs font-medium text-gray-500">Category</label>
        <select
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
          className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-400"
        >
          <option value="All">All</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {(filters.status !== 'All' || filters.category !== 'All') && (
        <button
          onClick={() => {
            onFilterChange('status', 'All');
            onFilterChange('category', 'All');
          }}
          className="text-xs text-gray-500 hover:text-gray-800 underline transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;

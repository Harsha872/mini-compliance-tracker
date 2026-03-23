import React from 'react';
import TaskItem from './TaskItem';
import FilterBar from './FilterBar';

function TaskList({ tasks, loading, error, filters, searchQuery, onSearchChange, onFilterChange, onToggleStatus, toggling }) {
  const categories = [...new Set(tasks.map((t) => t.category))].sort();

  const filtered = tasks.filter((task) => {
    const statusMatch = filters.status === 'All' || task.status === filters.status;
    const categoryMatch = filters.category === 'All' || task.category === filters.category;
    const query = searchQuery.trim().toLowerCase();
    const searchMatch =
      !query ||
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query) ||
      task.category.toLowerCase().includes(query);
    return statusMatch && categoryMatch && searchMatch;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-gray-400">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-4">
      {tasks.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title, description or category..."
            className="w-full sm:max-w-sm text-sm border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          />
          <FilterBar
            filters={filters}
            onFilterChange={onFilterChange}
            categories={categories}
          />
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-sm font-medium text-gray-500">No tasks available</p>
          <p className="text-xs text-gray-400 mt-1">Add a task to get started</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm font-medium text-gray-500">No tasks match your search</p>
          <button
            onClick={() => {
              onSearchChange('');
              onFilterChange('status', 'All');
              onFilterChange('category', 'All');
            }}
            className="text-xs text-gray-400 hover:text-gray-700 underline mt-1 transition-colors"
          >
            Clear search and filters
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onToggleStatus={onToggleStatus}
              toggling={toggling}
            />
          ))}
          <p className="text-xs text-gray-400 text-right mt-1">
            Showing {filtered.length} of {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}

export default TaskList;
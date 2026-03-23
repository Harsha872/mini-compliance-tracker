import React from 'react';
import { isOverdue, formatDate, priorityColors } from '../utils/helpers';

function TaskItem({ task, onToggleStatus, toggling }) {
  const overdue = isOverdue(task);
  const isCompleted = task.status === 'Completed';

  return (
    <div
      className={`rounded-lg border px-5 py-4 transition-colors ${
        overdue
          ? 'bg-red-50 border-red-200'
          : isCompleted
          ? 'bg-gray-50 border-gray-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p
              className={`text-sm font-semibold truncate ${
                isCompleted ? 'line-through text-gray-400' : 'text-gray-900'
              }`}
            >
              {task.title}
            </p>

            <span
              className={`text-xs font-medium px-2 py-0.5 rounded border ${
                priorityColors[task.priority]
              }`}
            >
              {task.priority}
            </span>

            {overdue && (
              <span className="text-xs font-medium px-2 py-0.5 rounded border text-red-700 bg-red-100 border-red-300">
                Overdue
              </span>
            )}
          </div>

          <p className={`text-xs mt-1 ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
            {task.description}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <span className="text-xs text-gray-400">
              <span className="font-medium text-gray-500">Category:</span> {task.category}
            </span>
            <span className={`text-xs ${overdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
              <span className="font-medium text-gray-500">Due:</span> {formatDate(task.due_date)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              isCompleted
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {task.status}
          </span>

          <button
            onClick={() => onToggleStatus(task._id)}
            disabled={toggling === task._id}
            className="text-xs text-gray-500 hover:text-gray-900 border border-gray-200 rounded-md px-2.5 py-1 hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {toggling === task._id
              ? 'Updating...'
              : isCompleted
              ? 'Mark Pending'
              : 'Mark Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskItem;

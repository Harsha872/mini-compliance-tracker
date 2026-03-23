export const isOverdue = (task) => {
  if (task.status === 'Completed') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.due_date);
  return due < today;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const priorityOrder = { High: 0, Medium: 1, Low: 2 };

export const priorityColors = {
  High: 'text-red-600 bg-red-50 border-red-200',
  Medium: 'text-yellow-700 bg-yellow-50 border-yellow-200',
  Low: 'text-green-700 bg-green-50 border-green-200',
};

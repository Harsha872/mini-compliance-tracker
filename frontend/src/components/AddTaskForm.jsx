import React, { useState } from 'react';

const INITIAL_FORM = {
  title: '',
  description: '',
  category: '',
  due_date: '',
  priority: 'Medium',
};

const CATEGORIES = ['Regulatory', 'Safety', 'Certification', 'HR Compliance', 'Reporting', 'Privacy', 'Other'];

function AddTaskForm({ clientId, onTaskAdded, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.category) newErrors.category = 'Category is required';
    if (!form.due_date) newErrors.due_date = 'Due date is required';
    if (!form.priority) newErrors.priority = 'Priority is required';
    return newErrors;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      await onTaskAdded({ ...form, client: clientId });
      setForm(INITIAL_FORM);
    } catch (err) {
      setSubmitError(err.message || 'Failed to add task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">New Task</h3>

      {submitError && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {submitError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g. Q3 Audit Review"
            className={`w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white ${
              errors.title ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Brief description of the task"
            rows={2}
            className={`w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white resize-none ${
              errors.description ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white ${
              errors.category ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Priority <span className="text-red-500">*</span>
          </label>
          <select
            value={form.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Due Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => handleChange('due_date', e.target.value)}
            className={`w-full text-sm border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white ${
              errors.due_date ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.due_date && <p className="text-xs text-red-500 mt-1">{errors.due_date}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          type="submit"
          disabled={submitting}
          className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Adding...' : 'Add Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default AddTaskForm;

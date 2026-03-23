import React, { useState } from 'react';

const INDUSTRIES = [
  'Finance',
  'Healthcare',
  'Manufacturing',
  'Energy',
  'Technology',
  'Retail',
  'Legal',
  'Education',
  'Real Estate',
  'Other',
];

const INITIAL_FORM = { name: '', industry: '', contact_email: '' };

function AddClientForm({ onClientAdded, onCancel }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.industry) newErrors.industry = 'Industry is required';
    if (!form.contact_email.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contact_email)) {
      newErrors.contact_email = 'Enter a valid email address';
    }
    return newErrors;
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    if (submitError) setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await onClientAdded(form);
      setForm(INITIAL_FORM);
    } catch (err) {
      setSubmitError(err.message || 'Failed to add client. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white px-5 py-4">
      <p className="text-xs font-semibold text-gray-700 mb-3">New Client</p>

      {submitError && (
        <div className="mb-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Client name"
            className={`w-full text-xs border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 ${
              errors.name ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <select
            value={form.industry}
            onChange={(e) => handleChange('industry', e.target.value)}
            className={`w-full text-xs border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white ${
              errors.industry ? 'border-red-400' : 'border-gray-200'
            }`}
          >
            <option value="">Select industry</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {errors.industry && <p className="text-xs text-red-500 mt-1">{errors.industry}</p>}
        </div>

        <div>
          <input
            type="email"
            value={form.contact_email}
            onChange={(e) => handleChange('contact_email', e.target.value)}
            placeholder="contact@company.com"
            className={`w-full text-xs border rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 ${
              errors.contact_email ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.contact_email && (
            <p className="text-xs text-red-500 mt-1">{errors.contact_email}</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 text-xs font-medium bg-gray-900 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Adding...' : 'Add Client'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-gray-500 hover:text-gray-800 px-3 py-2 border border-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddClientForm;

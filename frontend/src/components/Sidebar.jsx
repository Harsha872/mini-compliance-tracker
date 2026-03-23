import React, { useState } from 'react';

const INDUSTRIES = [
  'Finance', 'Healthcare', 'Manufacturing', 'Energy',
  'Technology', 'Retail', 'Legal', 'Education', 'Real Estate', 'Other',
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

function Sidebar({ clients, selectedClientId, onSelectClient, onClientAdded, loading, error }) {
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleClientAdded = async (formData) => {
    await onClientAdded(formData);
    setShowForm(false);
  };

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      client.name.toLowerCase().includes(query) ||
      client.industry.toLowerCase().includes(query) ||
      client.contact_email.toLowerCase().includes(query)
    );
  });

  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-gray-50 flex flex-col h-screen sticky top-0">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Clients
        </span>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            + Add
          </button>
        )}
      </div>

      {!showForm && (
        <div className="px-4 py-2 border-b border-gray-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full text-xs border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white"
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-2">
        {loading && (
          <div className="px-5 py-4 text-sm text-gray-400">Loading clients...</div>
        )}

        {error && (
          <div className="px-5 py-4">
            <p className="text-sm text-red-500">{error}</p>
            <p className="text-xs text-gray-400 mt-1">
              Make sure the backend is running on port 5000.
            </p>
          </div>
        )}

        {!loading && !error && clients.length === 0 && (
          <div className="px-5 py-6 text-sm text-gray-400 text-center">
            No clients available
          </div>
        )}

        {!loading && !error && clients.length > 0 && filteredClients.length === 0 && (
          <div className="px-5 py-6 text-center">
            <p className="text-sm text-gray-400">No clients match</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-gray-400 hover:text-gray-700 underline mt-1 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {!loading && !error && filteredClients.map((client) => {
          const isSelected = client._id === selectedClientId;
          return (
            <button
              key={client._id}
              onClick={() => onSelectClient(client)}
              className={`w-full text-left px-5 py-3 transition-colors ${
                isSelected
                  ? 'bg-white border-r-2 border-gray-900'
                  : 'hover:bg-white'
              }`}
            >
              <p className={`text-sm font-medium truncate ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                {client.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{client.industry}</p>
            </button>
          );
        })}
      </div>

      {showForm ? (
        <AddClientForm
          onClientAdded={handleClientAdded}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <div className="px-5 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            {filteredClients.length === clients.length
              ? `${clients.length} client${clients.length !== 1 ? 's' : ''}`
              : `${filteredClients.length} of ${clients.length} clients`}
          </p>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import TaskList from '../components/TaskList';
import AddTaskForm from '../components/AddTaskForm';
import { fetchClients, fetchTasksByClient, createTask, toggleTaskStatus, createClient } from '../services/api';

const DEFAULT_FILTERS = { status: 'All', category: 'All' };

function Dashboard() {
  const [clients, setClients] = useState([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [clientsError, setClientsError] = useState('');

  const [selectedClient, setSelectedClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState('');

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState(null);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await fetchClients();
        setClients(data);
      } catch (err) {
        setClientsError('Failed to load clients. Is the server running?');
      } finally {
        setClientsLoading(false);
      }
    };
    loadClients();
  }, []);

  const loadTasks = useCallback(async (clientId) => {
    setTasksLoading(true);
    setTasksError('');
    try {
      const data = await fetchTasksByClient(clientId);
      setTasks(data);
    } catch (err) {
      setTasksError('Failed to load tasks.');
    } finally {
      setTasksLoading(false);
    }
  }, []);

  const handleAddClient = async (clientData) => {
    const newClient = await createClient(clientData);
    setClients((prev) =>
      [...prev, newClient].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setShowAddForm(false);
    loadTasks(client._id);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleAddTask = async (taskData) => {
    const newTask = await createTask(taskData);
    setTasks((prev) => [newTask, ...prev]);
    setShowAddForm(false);
  };

  const handleToggleStatus = async (taskId) => {
    setTogglingTaskId(taskId);
    try {
      const updated = await toggleTaskStatus(taskId);
      setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
    } catch (err) {
      alert('Failed to update task status. Please try again.');
    } finally {
      setTogglingTaskId(null);
    }
  };

  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        clients={clients}
        selectedClientId={selectedClient?._id}
        onSelectClient={handleSelectClient}
        onClientAdded={handleAddClient}
        loading={clientsLoading}
        error={clientsError}
      />

      <main className="flex-1 overflow-y-auto">
        {!selectedClient ? (
          <div className="flex items-center justify-center h-full text-center px-8">
            <div>
              <p className="text-sm font-medium text-gray-500">Select a client</p>
              <p className="text-xs text-gray-400 mt-1">
                Choose a client from the sidebar to view and manage their tasks
              </p>
            </div>
          </div>
        ) : (
          <div className="px-8 py-7 max-w-4xl mx-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{selectedClient.name}</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedClient.industry} &middot; {selectedClient.contact_email}
                </p>
              </div>
              <button
                onClick={() => setShowAddForm((prev) => !prev)}
                className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                {showAddForm ? 'Cancel' : '+ Add Task'}
              </button>
            </div>

            {!tasksLoading && !tasksError && tasks.length > 0 && (
              <div className="flex gap-6 mb-6 pb-5 border-b border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Total Tasks</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Pending</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{completedCount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Completed</p>
                </div>
              </div>
            )}

            {showAddForm && (
              <div className="mb-5">
                <AddTaskForm
                  clientId={selectedClient._id}
                  onTaskAdded={handleAddTask}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}

            <TaskList
              tasks={tasks}
              loading={tasksLoading}
              error={tasksError}
              filters={filters}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onFilterChange={handleFilterChange}
              onToggleStatus={handleToggleStatus}
              toggling={togglingTaskId}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
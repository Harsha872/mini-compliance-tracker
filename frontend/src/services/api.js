const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const handleResponse = async (res) => {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'An unexpected error occurred' }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
};

export const fetchClients = () =>
  fetch(`${BASE_URL}/clients`).then(handleResponse);

export const createClient = (clientData) =>
  fetch(`${BASE_URL}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientData),
  }).then(handleResponse);

export const fetchTasksByClient = (clientId) =>
  fetch(`${BASE_URL}/tasks/${clientId}`).then(handleResponse);

export const createTask = (taskData) =>
  fetch(`${BASE_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  }).then(handleResponse);

export const toggleTaskStatus = (taskId) =>
  fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
  }).then(handleResponse);
import React from 'react';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="px-6 py-3 flex items-center gap-3">
          <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">C</span>
          </div>
          <span className="text-sm font-semibold text-gray-900 tracking-tight">
            Mini Compliance Tracker
          </span>
        </div>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;

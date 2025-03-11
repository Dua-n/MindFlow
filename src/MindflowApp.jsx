import React, { useState } from 'react';
import './index.css';

const MindflowApp = () => {
  const [activeTab, setActiveTab] = useState('journal');
  const [currentEntry, setCurrentEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!currentEntry.trim()) return;

    const newEntry = {
      id: Date.now(),
      text: currentEntry,
      timestamp: new Date().toLocaleString()
    };

    setJournalEntries([...journalEntries, newEntry]);
    setCurrentEntry('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Mindflow</h1>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setActiveTab('journal')}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'journal' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Journal
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'projects' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('focus')}
                className={`inline-flex items-center px-4 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'focus' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Focus
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'journal' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Journal</h2>
            <form onSubmit={handleJournalSubmit} className="mb-6">
              <div className="mt-1">
                <textarea
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                  placeholder="What's on your mind today?"
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                ></textarea>
              </div>
              <div className="mt-2">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Entry
                </button>
              </div>
            </form>

            <div className="mb-4">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Entries</h3>
                </div>
                <div className="border-t border-gray-200">
                  {journalEntries.length === 0 ? (
                    <p className="px-4 py-5 sm:px-6 text-gray-500">No entries yet. Start writing!</p>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {journalEntries.map((entry) => (
                        <li key={entry.id} className="px-4 py-4 sm:px-6">
                          <p className="text-sm text-gray-500">{entry.timestamp}</p>
                          <p className="mt-1 text-gray-900">{entry.text}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <p className="text-gray-500">Project management features coming soon.</p>
          </div>
        )}

        {activeTab === 'focus' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Focus Mode</h2>
            <p className="text-gray-500">Focus timer and productivity tools coming soon.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MindflowApp;
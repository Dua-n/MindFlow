import React, { useState } from 'react';
import './index.css';

function MindflowApp() {
  const [activeTab, setActiveTab] = useState('journal');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600">Mindflow</h1>
        <p className="text-center text-gray-600">Your Mindful Executive Assistant</p>
      </header>

      <nav className="flex justify-center mb-8">
        <div className="flex space-x-4 p-1 bg-white rounded-lg shadow-md">
          {['journal', 'projects', 'focus', 'analytics'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === tab
                  ? 'bg-indigo-500 text-white'
                  : 'text-gray-600 hover:bg-indigo-100'
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </nav>

      <main className="bg-white rounded-lg shadow-lg p-6 mb-8 max-w-4xl mx-auto">
        {activeTab === 'journal' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Journal</h2>
            <p>Your journal content will appear here.</p>
          </div>
        )}
        {activeTab === 'projects' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <p>Your projects will appear here.</p>
          </div>
        )}
        {activeTab === 'focus' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Focus</h2>
            <p>Your focus tasks will appear here.</p>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
            <p>Your analytics data will appear here.</p>
          </div>
        )}
      </main>
      <footer className="text-center text-gray-500 text-sm">
        <p>© 2023 Mindflow - Your Mindful Executive Assistant</p>
      </footer>
    </div>
  );
}

export default MindflowApp;
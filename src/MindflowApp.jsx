
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
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Journal</h2>
            <p className="mb-4 text-gray-700">
              This is your personal journal space. Track your thoughts and reflections.
            </p>
            <div className="flex mb-4">
              <div className="w-full p-4 border rounded-lg">
                <textarea 
                  className="w-full h-40 p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="What's on your mind today?">
                </textarea>
                <div className="flex justify-between mt-2">
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600">
                    Save Entry
                  </button>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                    Voice Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Projects</h2>
            <p className="mb-4 text-gray-700">
              Manage your projects and tasks here.
            </p>
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-bold text-lg mb-2">Add New Project</h3>
              <div className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  placeholder="Project Name" 
                  className="flex-1 p-2 border rounded"
                />
                <select className="p-2 border rounded">
                  <option>High Priority</option>
                  <option>Medium Priority</option>
                  <option>Low Priority</option>
                </select>
                <button className="px-4 py-2 bg-indigo-500 text-white rounded">Add</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'focus' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Focus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Pomodoro Timer</h3>
                <div className="text-center py-6">
                  <div className="text-5xl font-bold text-indigo-600 mb-4">25:00</div>
                  <div className="flex justify-center space-x-4">
                    <button className="px-4 py-2 bg-indigo-500 text-white rounded">Start</button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded">Reset</button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">Current Task</h3>
                <div className="py-4">
                  <p className="text-gray-700 mb-2">No task selected</p>
                  <button className="px-4 py-2 bg-indigo-500 text-white rounded">Select Task</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">Analytics</h2>
            <p className="mb-4 text-gray-700">
              View insights about your productivity and habits.
            </p>
            <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Analytics chart placeholder</p>
            </div>
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

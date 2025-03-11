
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

function MindflowApp() {
  const [activeTab, setActiveTab] = useState('journal');
  const [journalEntries, setJournalEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (currentEntry.trim()) {
      const newEntry = {
        id: Date.now(),
        text: currentEntry,
        timestamp: new Date(),
        date: new Date(currentDate)
      };
      setJournalEntries([...journalEntries, newEntry]);
      setCurrentEntry('');
    }
  };

  const handlePrevDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const handleNextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setCurrentDate(nextDate);
  };

  // Filter entries for current date
  const todaysEntries = journalEntries.filter(entry => 
    entry.date.toDateString() === currentDate.toDateString()
  );

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Journal</h2>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevDay}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  &lt;
                </button>
                <span className="text-lg">{formatDate(currentDate)}</span>
                <button 
                  onClick={handleNextDay}
                  className="p-2 rounded-md bg-gray-100 hover:bg-gray-200"
                >
                  &gt;
                </button>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-72 overflow-y-auto">
              {todaysEntries.length > 0 ? (
                todaysEntries.map(entry => (
                  <div key={entry.id} className="mb-4 p-3 bg-white rounded shadow">
                    <p className="text-gray-800">{entry.text}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No entries for today. Start writing!</p>
              )}
            </div>
            
            <form onSubmit={handleJournalSubmit} className="mt-4">
              <textarea
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
                rows="4"
                placeholder="Write your thoughts here..."
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
              ></textarea>
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Projects</h2>
            <p className="text-gray-600">Your project management dashboard will appear here.</p>
            <div className="p-4 bg-gray-100 rounded-lg mt-4">
              <p>Feature coming soon!</p>
            </div>
          </div>
        )}
        
        {activeTab === 'focus' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Focus</h2>
            <p className="text-gray-600">Your focus and productivity tools will appear here.</p>
            <div className="p-4 bg-gray-100 rounded-lg mt-4">
              <p>Feature coming soon!</p>
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Analytics</h2>
            <p className="text-gray-600">Your analytics and insights will appear here.</p>
            <div className="p-4 bg-gray-100 rounded-lg mt-4">
              <p>Feature coming soon!</p>
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

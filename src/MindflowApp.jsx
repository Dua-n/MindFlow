
import React, { useState, useEffect } from 'react';
import './index.css';

const MindflowApp = () => {
  const [activeTab, setActiveTab] = useState('journal');
  const [currentEntry, setCurrentEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState([]);
  const [projects, setProjects] = useState([
    { id: 1, name: 'Work Tasks', priority: 'high', color: '#4f46e5' },
    { id: 2, name: 'Personal Growth', priority: 'medium', color: '#16a34a' },
    { id: 3, name: 'Learning', priority: 'low', color: '#eab308' }
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Complete report', projectId: 1, completed: false, priority: 'high' },
    { id: 2, name: 'Review documents', projectId: 1, completed: false, priority: 'medium' },
    { id: 3, name: 'Meditation', projectId: 2, completed: false, priority: 'high' },
    { id: 4, name: 'Study React', projectId: 3, completed: false, priority: 'medium' }
  ]);
  
  // Focus timer state
  const [timerMinutes, setTimerMinutes] = useState(25);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Journal submit handler
  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!currentEntry.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      text: currentEntry,
      timestamp: new Date()
    };
    
    setJournalEntries([newEntry, ...journalEntries]);
    setCurrentEntry('');
  };

  // Standardize date format function
  const standardizeDates = (date) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  // Timer controls
  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  // Set preset timer durations
  const setTimerDuration = (minutes) => {
    setIsActive(false);
    setTimerMinutes(minutes);
    setTimerSeconds(0);
  };

  // Timer effect
  useEffect(() => {
    let interval = null;
    
    if (isActive) {
      interval = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            clearInterval(interval);
            setIsActive(false);
          } else {
            setTimerMinutes(timerMinutes - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds(timerSeconds - 1);
        }
      }, 1000);
    } else if (!isActive && interval) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, timerMinutes, timerSeconds]);

  // Sort projects by priority
  const sortedProjects = [...projects].sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Sort tasks by project priority then task priority
  const sortedTasks = [...tasks].sort((a, b) => {
    const projectA = projects.find(p => p.id === a.projectId);
    const projectB = projects.find(p => p.id === b.projectId);
    
    const projectPriorityOrder = { high: 1, medium: 2, low: 3 };
    const taskPriorityOrder = { high: 1, medium: 2, low: 3 };
    
    // First sort by project priority
    const projectPriorityDiff = projectPriorityOrder[projectA.priority] - projectPriorityOrder[projectB.priority];
    
    // If same project priority, sort by task priority
    if (projectPriorityDiff === 0) {
      return taskPriorityOrder[a.priority] - taskPriorityOrder[b.priority];
    }
    
    return projectPriorityDiff;
  });

  // Get project color by ID
  const getProjectColor = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.color : '#6b7280';
  };

  // Get project name by ID
  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Mindflow</h1>
        </div>
      </header>
      
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('journal')}
                className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'journal' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Journal
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'projects' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Projects
              </button>
              <button
                onClick={() => setActiveTab('focus')}
                className={`inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium ${
                  activeTab === 'focus' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Focus
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        {activeTab === 'journal' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Journal</h2>
            <form onSubmit={handleJournalSubmit} className="mb-4">
              <div className="bg-white shadow rounded-lg p-4">
                <textarea
                  value={currentEntry}
                  onChange={(e) => setCurrentEntry(e.target.value)}
                  placeholder="What's on your mind today?"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                  rows="4"
                ></textarea>
                <div className="mt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </form>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Recent Entries</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {journalEntries.length === 0 ? (
                  <p className="px-4 py-5 text-gray-500">No entries yet. Start writing!</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {journalEntries.map((entry) => (
                      <li key={entry.id} className="px-4 py-4">
                        <p className="text-sm text-gray-500 mb-1">{standardizeDates(entry.timestamp)}</p>
                        <p className="mt-1 text-gray-900">{entry.text}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Projects</h2>
            
            <div className="bg-white shadow rounded-lg p-4 mb-4">
              <h3 className="text-lg font-medium mb-2">Project List</h3>
              <ul className="space-y-3">
                {sortedProjects.map((project) => (
                  <li key={project.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div 
                        className="w-4 h-4 rounded-full mr-3" 
                        style={{ backgroundColor: project.color }}
                      ></div>
                      <span>{project.name}</span>
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-gray-200">
                        {project.priority}
                      </span>
                    </div>
                    <button 
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
                      aria-label={`Update ${project.name}`}
                    >
                      Update
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Tasks</h3>
              <ul className="space-y-2">
                {sortedTasks.map((task) => (
                  <li key={task.id} className="flex items-center p-2 hover:bg-gray-50 rounded-md">
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => {
                        setTasks(tasks.map(t => 
                          t.id === task.id ? {...t, completed: !t.completed} : t
                        ));
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div className="ml-3 flex-1">
                      <span className={task.completed ? 'line-through text-gray-400' : ''}>
                        {task.name}
                      </span>
                      <div className="flex items-center mt-1">
                        <div 
                          className="w-3 h-3 rounded-full mr-2" 
                          style={{ backgroundColor: getProjectColor(task.projectId) }}
                        ></div>
                        <span className="text-xs text-gray-500">{getProjectName(task.projectId)}</span>
                        <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-gray-200">
                          {task.priority}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'focus' && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Focus Timer</h2>
            
            <div className="bg-white shadow rounded-lg p-4 mb-4 max-w-md mx-auto">
              <div className="text-center">
                {/* Compact timer display */}
                <div className="text-4xl font-bold my-2">
                  {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                </div>
                
                {/* Preset duration buttons */}
                <div className="grid grid-cols-6 gap-1 mb-3">
                  {[5, 15, 25, 30, 45, 60].map(duration => (
                    <button
                      key={duration}
                      onClick={() => setTimerDuration(duration)}
                      className="px-1 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                    >
                      {duration}m
                    </button>
                  ))}
                </div>
                
                {/* Timer controls */}
                <div className="flex justify-center space-x-2 mb-3">
                  <button
                    onClick={toggleTimer}
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                  >
                    {isActive ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  >
                    Reset
                  </button>
                </div>
                
                {/* Task selection */}
                <div className="relative mt-2">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <div className="flex items-center">
                      {selectedTask ? (
                        <>
                          <div 
                            className="w-3 h-3 rounded-full mr-2"
                            style={{ backgroundColor: getProjectColor(selectedTask.projectId) }}
                          ></div>
                          <span>{selectedTask.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Select a task to focus on</span>
                      )}
                    </div>
                  </button>
                  
                  {isDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
                      {sortedTasks.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => {
                            setSelectedTask(task);
                            setIsDropdownOpen(false);
                          }}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getProjectColor(task.projectId) }}
                            ></div>
                            <span className={selectedTask && selectedTask.id === task.id ? 'font-semibold' : ''}>
                              {task.name}
                            </span>
                          </div>
                          {selectedTask && selectedTask.id === task.id && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                              ✓
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MindflowApp;

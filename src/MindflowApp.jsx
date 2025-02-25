import React, { useState, useMemo, useCallback } from 'react';
import { CheckCircle, Edit3, Mic, MoreHorizontal, Moon, Sun, X, Menu, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';

const initialJournalEntries = {
  "2025-02-25": [
    { id: 1, content: "Starting to plan the exhibition project. Need to contact the gallery owner by Friday.", timestamp: "10:23 AM", type: "text" },
    { id: 2, content: "Remembered I need to follow up on the grant application. Deadline is approaching.", timestamp: "11:45 AM", type: "text" },
    { id: 3, content: "Voice note about exhibition concept ideas", timestamp: "2:15 PM", type: "voice" }
  ],
  "2025-02-24": [
    { id: 1, content: "Met with the web designer today. We have a good direction for the site redesign.", timestamp: "9:15 AM", type: "text" },
    { id: 2, content: "Need to gather portfolio images for the website. Should schedule a photoshoot.", timestamp: "1:30 PM", type: "text" }
  ]
};

const journalAnalysis = {
  "2025-02-25": {
    themes: ["Exhibition planning", "Grant applications", "Deadlines"],
    sentiment: "Productive but slightly anxious",
    actionItems: ["Contact gallery", "Complete grant application"],
    wordCount: 42
  },
  "2025-02-24": {
    themes: ["Website redesign", "Portfolio development"],
    sentiment: "Positive and forward-moving",
    actionItems: ["Schedule photoshoot", "Gather portfolio materials"],
    wordCount: 38
  }
};

const projects = [
  { id: 1, name: "Art Exhibition", progress: 35, priority: "high", deadline: "March 15, 2025", color: "#D4A373" },
  { id: 2, name: "Website Redesign", progress: 68, priority: "medium", deadline: "April 3, 2025", color: "#E9C46A" },
  { id: 3, name: "Workshop Series", progress: 12, priority: "low", deadline: "May 20, 2025", color: "#CCD5AE" }
];

const priorityTasks = [
  {
    id: 1,
    projectId: 1,
    name: "Contact gallery about exhibition space",
    deadline: "February 28, 2025",
    steps: [
      { id: 1, description: "Draft email with proposal", completed: true },
      { id: 2, description: "Attach portfolio samples", completed: false },
      { id: 3, description: "Request available dates", completed: false }
    ]
  },
  {
    id: 2,
    projectId: 2,
    name: "Finalize website wireframes",
    deadline: "March 5, 2025",
    steps: [
      { id: 1, description: "Review current mockups", completed: true },
      { id: 2, description: "Annotate changes needed", completed: true },
      { id: 3, description: "Send feedback to designer", completed: false }
    ]
  }
];

const adminTasks = [
  { id: 1, description: "Pay studio rent", deadline: "February 28, 2025", completed: false },
  { id: 2, description: "File quarterly taxes", deadline: "April 15, 2025", completed: false },
  { id: 3, description: "Renew professional membership", deadline: "March 10, 2025", completed: false }
];

const assistantMessages = [
  { 
    id: 1, 
    message: "I notice the Art Exhibition has the highest priority but lowest progress. Would breaking down the next steps help overcome any blocks you're experiencing?", 
    timestamp: "9:05 AM",
    options: ["Yes, let's break it down", "I'm stuck for another reason", "Not right now"],
    selectedOption: 0,
    expanded: true
  },
  { 
    id: 2, 
    message: "Your grant application deadline is approaching. You mentioned this in your journal twice this week - it seems important and possibly causing some stress.", 
    timestamp: "9:10 AM",
    options: ["Schedule focused time", "Delegate parts of this", "Tell me more"]
  }
];

const reflectionPrompts = [
  "How is your body feeling right now? Where do you notice tension or ease?",
  "What parts of yourself are showing up today? Can you listen to what they need?",
  "What boundaries would support your wellbeing right now?",
  "How are your relationships nourishing or depleting you this week?",
  "What sensations arise when you think about your current challenges?",
  "Where in your body do you feel resistance to your priority tasks?",
  "What would your wisest self say about your current situation?"
];

const CustomIcon = ({ type }) => {
  switch(type) {
    case 'journal':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6,3 Q4,3 4,5 L4,19 Q4,21 6,21 L18,21 Q20,21 20,19 L20,5 Q20,3 18,3 Z" strokeLinecap="round" />
          <path d="M8,8 L16,8 M8,12 L16,12 M8,16 L13,16" strokeLinecap="round" />
        </svg>
      );
    case 'projects':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5,5 L10,5 L10,10 L5,10 Z M14,5 L19,5 L19,10 L14,10 Z M5,14 L10,14 L10,19 L5,19 Z M14,14 L19,14 L19,19 L14,19 Z" strokeLinecap="round" />
        </svg>
      );
    case 'focus':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path d="M12,4 L12,6 M12,18 L12,20 M4,12 L6,12 M18,12 L20,12" strokeLinecap="round" />
        </svg>
      );
    case 'admin':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5,12 L8,12 M11,12 L14,12 M17,12 L20,12" strokeLinecap="round" />
          <path d="M5,7 L20,7 M5,17 L20,17" strokeLinecap="round" />
        </svg>
      );
    case 'reflection':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12,21 C7,21 3,16.97 3,12 C3,7.03 7,3 12,3 C17,3 21,7.03 21,12" strokeLinecap="round" />
          <path d="M9,10 C9,8.9 10.3,8 12,8 C13.7,8 15,8.9 15,10 C15,10.85 14.37,11.57 13.43,11.85 C12.5,12.13 12,12.89 12,13.5" strokeLinecap="round" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
      );
    case 'assistant':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12,3 C7.03,3 3,7.03 3,12 L3,18 L7,16 C8.5,16.67 10.2,17 12,17 C16.97,17 21,13 21,8 C21,5.24 19.24,3 16.5,3 Z" strokeLinecap="round" />
          <path d="M8,10 L10,10 M14,10 L16,10" strokeLinecap="round" />
          <path d="M9,14 C10.5,15 13.5,15 15,14" strokeLinecap="round" />
        </svg>
      );
    case 'mic':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12,2 L12,2 C13.66,2 15,3.34 15,5 L15,12 C15,13.66 13.66,15 12,15 L12,15 C10.34,15 9,13.66 9,12 L9,5 C9,3.34 10.34,2 12,2 Z" strokeLinecap="round" />
          <path d="M6,10 L6,12 C6,15.31 8.69,18 12,18 C15.31,18 18,15.31 18,12 L18,10" strokeLinecap="round" />
          <path d="M12,18 L12,22 M9,22 L15,22" strokeLinecap="round" />
        </svg>
      );
    case 'add':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M12,8 L12,16 M8,12 L16,12" strokeLinecap="round" />
        </svg>
      );
    case 'calendar':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="5" width="16" height="16" rx="2" />
          <path d="M4,10 L20,10" strokeLinecap="round" />
          <path d="M8,3 L8,7 M16,3 L16,7" strokeLinecap="round" />
          <path d="M8,14 L8,14 M12,14 L12,14 M16,14 L16,14 M8,18 L8,18 M12,18 L12,18 M16,18 L16,18" strokeLinecap="round" strokeWidth="2" />
        </svg>
      );
    case 'analysis':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5,21 L5,12 M10,21 L10,8 M15,21 L15,14 M20,21 L20,4" strokeLinecap="round" />
          <path d="M3,12 L7,12 M8,8 L12,8 M13,14 L17,14 M18,4 L22,4" strokeLinecap="round" />
        </svg>
      );
    case 'mode':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12,3 C7.03,3 3,7.03 3,12 C3,16.97 7.03,21 12,21 C16.97,21 21,16.97 21,12 C21,7.03 16.97,3 12,3 Z" />
          <path d="M12,9 C13.66,9 15,10.34 15,12 C15,13.66 13.66,15 12,15 C10.34,15 9,13.66 9,12 C9,10.34 10.34,9 12,9 Z" fill="currentColor" />
        </svg>
      );
    default:
      return null;
  }
};

const formatDisplayDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

const MindflowApp = () => {
  const [activeTab, setActiveTab] = useState('journal');
  const [darkMode, setDarkMode] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentJournalDate, setCurrentJournalDate] = useState(new Date());
  const [newEntry, setNewEntry] = useState("");
  const [reflectionContent, setReflectionContent] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentFocusTaskId, setCurrentFocusTaskId] = useState(1);
  const [journalEntriesState, setJournalEntriesState] = useState(initialJournalEntries);

  // Memoize colors based on dark mode
  const colors = useMemo(() => {
    if (darkMode) {
      return {
        primary: '#CB904D',
        secondary: '#3A1E09',
        accent: '#E9D8B4',
        text: '#E9D8B4',
        background: 'linear-gradient(135deg, #261A15 0%, #3A1E09 100%)',
        cardBg: '#32281E',
        cardHighlight: '#483726',
        buttonBg: '#CB904D',
        buttonText: '#261A15',
        highlight: '#E9D8B4'
      };
    } else {
      return {
        primary: '#D4A373',
        secondary: '#FAEDCD',
        accent: '#E9C46A',
        text: '#4A4238',
        background: 'linear-gradient(135deg, #FAEDCD 0%, #E9EDC9 100%)',
        cardBg: '#FEFAE0',
        cardHighlight: '#E9EDC9',
        buttonBg: '#D4A373',
        buttonText: '#FEFAE0',
        highlight: '#CCD5AE'
      };
    }
  }, [darkMode]);

  const getCurrentDateKey = useCallback(() => {
    return currentJournalDate.toISOString().split('T')[0];
  }, [currentJournalDate]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const toggleAssistant = useCallback(() => {
    setShowAssistant(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const navigateJournalDate = useCallback((direction) => {
    const newDate = new Date(currentJournalDate);
    direction === 'prev'
      ? newDate.setDate(newDate.getDate() - 1)
      : newDate.setDate(newDate.getDate() + 1);
    setCurrentJournalDate(newDate);
  }, [currentJournalDate]);

  const nextReflectionPrompt = useCallback(() => {
    setCurrentPromptIndex((currentPromptIndex + 1) % reflectionPrompts.length);
    setReflectionContent("");
  }, [currentPromptIndex]);

  const getProjectById = useCallback((projectId) => {
    return projects.find(project => project.id === projectId);
  }, []);

  const getCurrentFocusTask = useCallback(() => {
    return priorityTasks.find(task => task.id === currentFocusTaskId);
  }, [currentFocusTaskId]);

  // Save the new journal entry and update state
  const saveJournalEntry = useCallback(() => {
    const dateKey = getCurrentDateKey();
    const timeStamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newEntryObject = {
      id: Date.now(),
      content: newEntry,
      timestamp: timeStamp,
      type: "text"
    };
    setJournalEntriesState(prevState => ({
      ...prevState,
      [dateKey]: [...(prevState[dateKey] || []), newEntryObject]
    }));
    setNewEntry("");
  }, [newEntry, getCurrentDateKey]);

  // Handle Enter key to save a new journal entry
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newEntry.trim()) {
        saveJournalEntry();
      }
    }
  };

  // Sidebar component
  const Sidebar = ({ activeTab, setActiveTab, toggleDarkMode, toggleAssistant, sidebarOpen, toggleSidebar, colors }) => (
    <div className={`sidebar ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 md:relative absolute z-40 flex flex-col w-64 h-full p-4 rounded-r-3xl shadow-lg`}
      style={{ background: colors.cardBg, color: colors.text }}
    >
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Mindflow</h1>
        <button onClick={toggleDarkMode} style={{ color: colors.accent }}>
          <CustomIcon type="mode" />
        </button>
      </div>
      <nav className="flex-grow">
        <ul className="space-y-1">
          <li>
            <button 
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === 'journal' ? 'font-medium' : ''}`}
              onClick={() => setActiveTab('journal')}
              style={{ 
                background: activeTab === 'journal' ? colors.cardHighlight : 'transparent',
                color: activeTab === 'journal' ? colors.primary : colors.text
              }}
            >
              <span className="mr-3"><CustomIcon type="journal" /></span>
              <span>Journal</span>
            </button>
          </li>
          <li>
            <button 
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === 'projects' ? 'font-medium' : ''}`}
              onClick={() => setActiveTab('projects')}
              style={{ 
                background: activeTab === 'projects' ? colors.cardHighlight : 'transparent',
                color: activeTab === 'projects' ? colors.primary : colors.text
              }}
            >
              <span className="mr-3"><CustomIcon type="projects" /></span>
              <span>Projects</span>
            </button>
          </li>
          <li>
            <button 
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === 'focus' ? 'font-medium' : ''}`}
              onClick={() => setActiveTab('focus')}
              style={{ 
                background: activeTab === 'focus' ? colors.cardHighlight : 'transparent',
                color: activeTab === 'focus' ? colors.primary : colors.text
              }}
            >
              <span className="mr-3"><CustomIcon type="focus" /></span>
              <span>Focus</span>
            </button>
          </li>
          <li>
            <button 
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === 'admin' ? 'font-medium' : ''}`}
              onClick={() => setActiveTab('admin')}
              style={{ 
                background: activeTab === 'admin' ? colors.cardHighlight : 'transparent',
                color: activeTab === 'admin' ? colors.primary : colors.text
              }}
            >
              <span className="mr-3"><CustomIcon type="admin" /></span>
              <span>Admin</span>
            </button>
          </li>
          <li>
            <button 
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === 'reflection' ? 'font-medium' : ''}`}
              onClick={() => setActiveTab('reflection')}
              style={{ 
                background: activeTab === 'reflection' ? colors.cardHighlight : 'transparent',
                color: activeTab === 'reflection' ? colors.primary : colors.text
              }}
            >
              <span className="mr-3"><CustomIcon type="reflection" /></span>
              <span>Reflection</span>
            </button>
          </li>
        </ul>
      </nav>
      <button 
        className="mt-auto flex items-center justify-center p-3 rounded-xl transition-colors"
        onClick={toggleAssistant}
        style={{ background: colors.buttonBg, color: colors.buttonText }}
      >
        <span className="mr-2"><CustomIcon type="assistant" /></span>
        <span>Assistant</span>
      </button>
      {sidebarOpen && (
        <button 
          className="md:hidden absolute top-4 right-4" 
          onClick={toggleSidebar}
          style={{ color: colors.text }}
        >
          <X size={24} />
        </button>
      )}
    </div>
  );

  // Assistant Panel component
  const AssistantPanel = ({ toggleAssistant, colors, assistantMessages }) => (
    <div 
      className="w-80 h-full p-4 shadow-lg rounded-l-3xl overflow-hidden flex flex-col"
      style={{ background: colors.cardBg }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold">Executive Assistant</h2>
        <button onClick={toggleAssistant} style={{ color: colors.text }}>
          <X size={20} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto mb-4">
        {assistantMessages.map(msg => (
          <div 
            key={msg.id} 
            className="mb-3 p-3 rounded-xl"
            style={{ background: colors.cardHighlight }}
          >
            <div className="text-xs opacity-70 mb-1">{msg.timestamp}</div>
            <p>{msg.message}</p>
            {msg.options && (
              <div className="flex flex-wrap justify-end mt-2 gap-2">
                {msg.options.map((option, idx) => (
                  <button 
                    key={idx} 
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ 
                      background: msg.selectedOption === idx ? colors.buttonBg : 'transparent',
                      color: msg.selectedOption === idx ? colors.buttonText : colors.primary,
                      border: `1px solid ${colors.primary}`
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
            {msg.expanded && msg.selectedOption === 0 && (
              <div 
                className="mt-3 p-2 rounded-lg text-sm"
                style={{ background: colors.cardBg }}
              >
                <p className="mb-2">Let's break down the exhibition project:</p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Contact gallery this week (priority)</li>
                  <li>Finalize artwork selection</li>
                  <li>Arrange transportation logistics</li>
                  <li>Prepare artist statement</li>
                </ol>
                <p className="mt-2">Would you like me to add these as steps to your focus task?</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div 
        className="p-3 rounded-xl"
        style={{ background: colors.cardHighlight }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">System Overview:</h3>
          <span className="text-xs">Feb 25, 2025</span>
        </div>
        <ul className="text-sm space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <div>
              <span style={{ color: colors.primary }}>Priority:</span> Art Exhibition (35% complete)
              <div className="text-xs opacity-70 mt-1">Needs attention - Progress stalled for 5 days</div>
            </div>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <div>
              <span style={{ color: colors.primary }}>Upcoming:</span> Studio rent payment (3 days)
            </div>
          </li>
        </ul>
        <div className="mt-4">
          <button
            className="w-full py-2 rounded-xl text-sm"
            style={{ background: colors.buttonBg, color: colors.buttonText }}
          >
            Ask me anything...
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: colors.background, color: colors.text }}>
      {/* Mobile menu button */}
      <button 
        className="md:hidden absolute top-4 left-4 z-50 menu-button" 
        onClick={toggleSidebar}
        style={{ color: colors.text }}
      >
        <Menu size={24} />
      </button>
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        toggleDarkMode={toggleDarkMode} 
        toggleAssistant={toggleAssistant}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        colors={colors}
      />
      {/* Main content */}
      <div className="flex-grow overflow-hidden h-full p-4">
        {activeTab === 'journal' && (
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Daily Journal</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigateJournalDate('prev')}
                  className="p-1 rounded-full"
                  style={{ color: colors.primary }}
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex items-center">
                  <span className="mr-2"><CustomIcon type="calendar" /></span>
                  <span>{formatDisplayDate(currentJournalDate)}</span>
                </div>
                <button 
                  onClick={() => navigateJournalDate('next')}
                  className="p-1 rounded-full"
                  style={{ color: colors.primary }}
                >
                  <ArrowRight size={18} />
                </button>
                <button 
                  className="ml-2 p-1 rounded-full"
                  style={{ color: colors.primary }}
                  title="View Analysis"
                >
                  <CustomIcon type="analysis" />
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto mb-4 p-4 rounded-2xl shadow-md" style={{ background: colors.cardBg }}>
              {(journalEntriesState[getCurrentDateKey()] || []).map(entry => (
                <div key={entry.id} className="mb-4 p-3 rounded-xl" style={{ background: colors.cardHighlight }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs opacity-70">{entry.timestamp}</span>
                    <MoreHorizontal size={16} className="opacity-50 cursor-pointer" />
                  </div>
                  {entry.type === 'voice' ? (
                    <div className="flex items-center">
                      <span className="mr-2" style={{ color: colors.primary }}><CustomIcon type="mic" /></span>
                      <span>{entry.content}</span>
                    </div>
                  ) : (
                    <p>{entry.content}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex rounded-xl shadow-md overflow-hidden">
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Capture your thoughts... (press Enter to save)"
                className="flex-grow p-3 resize-none outline-none"
                style={{ background: colors.cardBg }}
                rows={3}
              />
              <div className="flex flex-col">
                <button 
                  className="h-1/2 p-3 transition-colors" 
                  style={{ background: colors.cardHighlight }}
                >
                  <span style={{ color: colors.primary }}><CustomIcon type="mic" /></span>
                </button>
                <button 
                  className="h-1/2 p-3 transition-colors"
                  style={{ background: colors.buttonBg, color: colors.buttonText }}
                  onClick={saveJournalEntry}
                >
                  <span><CustomIcon type="add" /></span>
                </button>
              </div>
            </div>
            {journalAnalysis[getCurrentDateKey()] && (
              <div className="mt-4 p-4 rounded-2xl shadow-md" style={{ background: colors.cardBg }}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Today's Patterns</h3>
                  <div className="text-xs opacity-70">{journalAnalysis[getCurrentDateKey()].wordCount} words</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Themes</h4>
                    <div className="flex flex-wrap gap-1">
                      {journalAnalysis[getCurrentDateKey()].themes.map((theme, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-1 rounded-xl text-xs"
                          style={{ background: colors.cardHighlight, color: colors.primary }}
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Mood</h4>
                    <div 
                      className="px-2 py-1 rounded-xl text-sm inline-block"
                      style={{ background: colors.cardHighlight, color: colors.primary }}
                    >
                      {journalAnalysis[getCurrentDateKey()].sentiment}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <h4 className="text-sm font-medium mb-1">Action Items</h4>
                  <ul className="text-sm space-y-1">
                    {journalAnalysis[getCurrentDateKey()].actionItems.map((item, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      {showAssistant && (
        <AssistantPanel 
          toggleAssistant={toggleAssistant}
          colors={colors}
          assistantMessages={assistantMessages}
        />
      )}
    </div>
  );
};
export default MindflowApp;

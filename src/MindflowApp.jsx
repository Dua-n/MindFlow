import React, { useState, useMemo, useCallback } from "react";
import {
  CheckCircle,
  Edit3,
  Mic,
  MoreHorizontal,
  Moon,
  Sun,
  X,
  Menu,
  MessageSquare,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
// Journal Entries
const initialJournalEntries = {
  "2025-02-25": [
    {
      id: 1,
      content:
        "Starting to plan the exhibition project. Need to contact the gallery owner by Friday.",
      timestamp: "10:23 AM",
      type: "text",
    },
    {
      id: 2,
      content:
        "Remembered I need to follow up on the grant application. Deadline is approaching.",
      timestamp: "11:45 AM",
      type: "text",
    },
    {
      id: 3,
      content: "Voice note about exhibition concept ideas",
      timestamp: "2:15 PM",
      type: "voice",
    },
  ],
  "2025-02-24": [
    {
      id: 1,
      content:
        "Met with the web designer today. We have a good direction for the site redesign.",
      timestamp: "9:15 AM",
      type: "text",
    },
    {
      id: 2,
      content:
        "Need to gather portfolio images for the website. Should schedule a photoshoot.",
      timestamp: "1:30 PM",
      type: "text",
    },
  ],
};

const journalAnalysis = {
  "2025-02-25": {
    themes: ["Exhibition planning", "Grant applications", "Deadlines"],
    sentiment: "Productive but slightly anxious",
    actionItems: ["Contact gallery", "Complete grant application"],
    wordCount: 42,
  },
  "2025-02-24": {
    themes: ["Website redesign", "Portfolio development"],
    sentiment: "Positive and forward-moving",
    actionItems: ["Schedule photoshoot", "Gather portfolio materials"],
    wordCount: 38,
  },
};

const projects = [
  {
    id: 1,
    name: "Art Exhibition",
    progress: 35,
    priority: "high",
    deadline: "March 15, 2025",
    color: "#D4A373",
  },
  {
    id: 2,
    name: "Website Redesign",
    progress: 68,
    priority: "medium",
    deadline: "April 3, 2025",
    color: "#E9C46A",
  },
  {
    id: 3,
    name: "Workshop Series",
    progress: 12,
    priority: "low",
    deadline: "May 20, 2025",
    color: "#CCD5AE",
  },
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
      { id: 3, description: "Request available dates", completed: false },
    ],
  },
  {
    id: 2,
    projectId: 2,
    name: "Finalize website wireframes",
    deadline: "March 5, 2025",
    steps: [
      { id: 1, description: "Review current mockups", completed: true },
      { id: 2, description: "Annotate changes needed", completed: true },
      { id: 3, description: "Send feedback to designer", completed: false },
    ],
  },
];

const adminTasks = [
  {
    id: 1,
    description: "Pay studio rent",
    deadline: "February 28, 2025",
    completed: false,
  },
  {
    id: 2,
    description: "File quarterly taxes",
    deadline: "April 15, 2025",
    completed: false,
  },
  {
    id: 3,
    description: "Renew professional membership",
    deadline: "March 10, 2025",
    completed: false,
  },
];

const assistantMessages = [
  {
    id: 1,
    message:
      "I notice the Art Exhibition has the highest priority but lowest progress. Would breaking down the next steps help overcome any blocks you're experiencing?",
    timestamp: "9:05 AM",
    options: [
      "Yes, let's break it down",
      "I'm stuck for another reason",
      "Not right now",
    ],
    selectedOption: 0,
    expanded: true,
  },
  {
    id: 2,
    message:
      "Your grant application deadline is approaching. You mentioned this in your journal twice this week - it seems important and possibly causing some stress.",
    timestamp: "9:10 AM",
    options: [
      "Schedule focused time",
      "Delegate parts of this",
      "Tell me more",
    ],
  },
];

const reflectionPrompts = [
  "How is your body feeling right now? Where do you notice tension or ease?",
  "What parts of yourself are showing up today? Can you listen to what they need?",
  "What boundaries would support your wellbeing right now?",
  "How are your relationships nourishing or depleting you this week?",
  "What sensations arise when you think about your current challenges?",
  "Where in your body do you feel resistance to your priority tasks?",
  "What would your wisest self say about your current situation?",
];

const CustomIcon = ({ type }) => {
  switch (type) {
    case "journal":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M6,3 Q4,3 4,5 L4,19 Q4,21 6,21 L18,21 Q20,21 20,19 L20,5 Q20,3 18,3 Z"
            strokeLinecap="round"
          />
          <path
            d="M8,8 L16,8 M8,12 L16,12 M8,16 L13,16"
            strokeLinecap="round"
          />
        </svg>
      );
    case "projects":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M5,5 L10,5 L10,10 L5,10 Z M14,5 L19,5 L19,10 L14,10 Z M5,14 L10,14 L10,19 L5,19 Z M14,14 L19,14 L19,19 L14,19 Z"
            strokeLinecap="round"
          />
        </svg>
      );
    case "focus":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
          <path
            d="M12,4 L12,6 M12,18 L12,20 M4,12 L6,12 M18,12 L20,12"
            strokeLinecap="round"
          />
        </svg>
      );
    case "admin":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M5,12 L8,12 M11,12 L14,12 M17,12 L20,12"
            strokeLinecap="round"
          />
          <path d="M5,7 L20,7 M5,17 L20,17" strokeLinecap="round" />
        </svg>
      );
    case "reflection":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12,21 C7,21 3,16.97 3,12 C3,7.03 7,3 12,3 C17,3 21,7.03 21,12"
            strokeLinecap="round"
          />
          <path
            d="M9,10 C9,8.9 10.3,8 12,8 C13.7,8 15,8.9 15,10 C15,10.85 14.37,11.57 13.43,11.85 C12.5,12.13 12,12.89 12,13.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
      );
    case "assistant":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12,3 C7.03,3 3,7.03 3,12 L3,18 L7,16 C8.5,16.67 10.2,17 12,17 C16.97,17 21,13 21,8 C21,5.24 19.24,3 16.5,3 Z"
            strokeLinecap="round"
          />
          <path d="M8,10 L10,10 M14,10 L16,10" strokeLinecap="round" />
          <path d="M9,14 C10.5,15 13.5,15 15,14" strokeLinecap="round" />
        </svg>
      );
    case "mic":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M12,2 L12,2 C13.66,2 15,3.34 15,5 L15,12 C15,13.66 13.66,15 12,15 L12,15 C10.34,15 9,13.66 9,12 L9,5 C9,3.34 10.34,2 12,2 Z"
            strokeLinecap="round"
          />
          <path
            d="M6,10 L6,12 C6,15.31 8.69,18 12,18 C15.31,18 18,15.31 18,12 L18,10"
            strokeLinecap="round"
          />
          <path d="M12,18 L12,22 M9,22 L15,22" strokeLinecap="round" />
        </svg>
      );
    case "add":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12,8 L12,16 M8,12 L16,12" strokeLinecap="round" />
        </svg>
      );
    case "calendar":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="4" y="5" width="16" height="16" rx="2" />
          <path d="M4,10 L20,10" strokeLinecap="round" />
          <path d="M8,3 L8,7 M16,3 L16,7" strokeLinecap="round" />
          <path
            d="M8,14 L8,14 M12,14 L12,14 M16,14 L16,14 M8,18 L8,18 M12,18 L12,18 M16,18 L16,18"
            strokeLinecap="round"
            strokeWidth="2"
          />
        </svg>
      );
    case "analysis":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            d="M5,21 L5,12 M10,21 L10,8 M15,21 L15,14 M20,21 L20,4"
            strokeLinecap="round"
          />
          <path
            d="M3,12 L7,12 M8,8 L12,8 M13,14 L17,14 M18,4 L22,4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "mode":
      return (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12,3 C7.03,3 3,7.03 3,12 C3,16.97 7.03,21 12,21 C16.97,21 21,16.97 21,12 C21,7.03 16.97,3 12,3 Z" />
          <path
            d="M12,9 C13.66,9 15,10.34 15,12 C15,13.66 13.66,15 12,15 C10.34,15 9,13.66 9,12 C9,10.34 10.34,9 12,9 Z"
            fill="currentColor"
          />
        </svg>
      );
    default:
      return null;
  }
};

const formatDisplayDate = (date) => {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const MindflowApp = () => {
  const [activeTab, setActiveTab] = useState("journal");
  const [darkMode, setDarkMode] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentJournalDate, setCurrentJournalDate] = useState(new Date());
  const [newEntry, setNewEntry] = useState("");
  const [reflectionContent, setReflectionContent] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [currentFocusTaskId, setCurrentFocusTaskId] = useState(1);
  const [journalEntriesState, setJournalEntriesState] = useState(
    initialJournalEntries,
  );
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [journalAnalysisState, setJournalAnalysisState] = useState(journalAnalysis);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [monthlyWrapUps, setMonthlyWrapUps] = useState({
    "2025-02-28": {
      themes: ["Exhibition planning", "Website development", "Time management"],
      insights: "February showed consistent focus on the exhibition project, with some anxiety about deadlines. The website redesign gained momentum mid-month. Several opportunities for collaboration emerged.",
      progress: 65,
      blockers: ["Grant application process", "Limited studio space"],
      recommendations: ["Schedule dedicated time for grant writing", "Consider temporary expanded workspace options"]
    }
  });
  
  // Project tab state
  const [projectsState, setProjectsState] = useState(
    // Sort projects by priority (high > medium > low)
    [...projects].sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
  );
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editProjectProgress, setEditProjectProgress] = useState(0);
  const [newProject, setNewProject] = useState({
    name: '',
    priority: 'medium',
    deadline: '',
    color: '#D4A373'
  });
  
  // Task state
  const [priorityTasksState, setPriorityTasksState] = useState(priorityTasks);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    projectId: 1,
    deadline: '',
    steps: [{ id: Date.now(), description: '', completed: false }]
  });
  
  // Focus timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' or 'break'
  const [timerInterval, setTimerIntervalId] = useState(null);
  
  // Admin tasks state
  const [adminTasksState, setAdminTasksState] = useState(adminTasks);
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showNewAdminTaskModal, setShowNewAdminTaskModal] = useState(false);
  const [newAdminTask, setNewAdminTask] = useState({
    description: '',
    deadline: '',
    completed: false
  });

  // Memoize colors based on dark mode
  const colors = useMemo(() => {
    if (darkMode) {
      return {
        primary: "#CB904D",
        secondary: "#3A1E09",
        accent: "#E9D8B4",
        text: "#E9D8B4",
        background: "linear-gradient(135deg, #261A15 0%, #3A1E09 100%)",
        cardBg: "#32281E",
        cardHighlight: "#483726",
        buttonBg: "#CB904D",
        buttonText: "#261A15",
        highlight: "#E9D8B4",
      };
    } else {
      return {
        primary: "#D4A373",
        secondary: "#FAEDCD",
        accent: "#E9C46A",
        text: "#4A4238",
        background: "linear-gradient(135deg, #FAEDCD 0%, #E9EDC9 100%)",
        cardBg: "#FEFAE0",
        cardHighlight: "#E9EDC9",
        buttonBg: "#D4A373",
        buttonText: "#FEFAE0",
        highlight: "#CCD5AE",
      };
    }
  }, [darkMode]);

  const getCurrentDateKey = useCallback(() => {
    return currentJournalDate.toISOString().split("T")[0];
  }, [currentJournalDate]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  const toggleAssistant = useCallback(() => {
    setShowAssistant((prev) => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const navigateJournalDate = useCallback(
    (direction) => {
      const newDate = new Date(currentJournalDate);
      direction === "prev"
        ? newDate.setDate(newDate.getDate() - 1)
        : newDate.setDate(newDate.getDate() + 1);
      setCurrentJournalDate(newDate);
    },
    [currentJournalDate],
  );

  const nextReflectionPrompt = useCallback(() => {
    setCurrentPromptIndex((currentPromptIndex + 1) % reflectionPrompts.length);
    setReflectionContent("");
  }, [currentPromptIndex]);

  const getProjectById = useCallback((projectId) => {
    return projects.find((project) => project.id === projectId);
  }, []);

  const getCurrentFocusTask = useCallback(() => {
    return priorityTasks.find((task) => task.id === currentFocusTaskId);
  }, [currentFocusTaskId]);

  // Save the new journal entry and update state
  const saveJournalEntry = useCallback(() => {
    if (newEntry.trim() === "") return;
    
    const dateKey = getCurrentDateKey();
    const timeStamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const newEntryObject = {
      id: Date.now(),
      content: newEntry,
      timestamp: timeStamp,
      type: "text",
    };
    
    setJournalEntriesState((prevState) => {
      // Create a new array if no entries exist for this date
      const existingEntries = prevState[dateKey] || [];
      
      return {
        ...prevState,
        [dateKey]: [...existingEntries, newEntryObject],
      };
    });
    
    // Also add simple analysis if this is the first entry of the day
    if (!journalAnalysis[dateKey]) {
      // In a real app, this would be generated by AI or more complex logic
      const newAnalysis = {
        themes: ["New thoughts"],
        sentiment: "Neutral",
        actionItems: [],
        wordCount: newEntry.split(/\s+/).length,
      };
      
      // For demonstration, we're manually updating the analysis
      // In a real app, you'd probably use a state setter function
      journalAnalysis[dateKey] = newAnalysis;
    }
    
    setNewEntry("");
  }, [newEntry, getCurrentDateKey, journalAnalysis]);

  // Handle Enter key to save a new journal entry
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (newEntry.trim()) {
        saveJournalEntry();
      }
    }
  };

  // Voice recording functionality
  const startRecording = useCallback(() => {
    // In a real app, this would use the MediaRecorder API
    // For demo purposes, we'll simulate recording
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start the timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Store the timer ID for cleanup
    window.recordingTimer = timer;
  }, []);
  
  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    // Clear the timer
    if (window.recordingTimer) {
      clearInterval(window.recordingTimer);
    }
    
    // In a real app, this would stop the MediaRecorder and save the audio
    // For demo purposes, we'll add a simulated voice note
    const dateKey = getCurrentDateKey();
    const timeStamp = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    
    const newVoiceEntry = {
      id: Date.now(),
      content: `Voice recording (${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')})`,
      timestamp: timeStamp,
      type: "voice",
    };
    
    setJournalEntriesState(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newVoiceEntry]
    }));
    
    // Reset recording time
    setRecordingTime(0);
  }, [recordingTime, getCurrentDateKey]);
  
  // Format recording time as MM:SS
  const formatRecordingTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Standardize date format to Month Day, Year
  const standardizeDate = (dateStr) => {
    if (!dateStr) return '';
    
    // Convert from yyyy-mm-dd format if needed
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [year, month, day] = dateStr.split('-');
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    }
    
    // Otherwise, parse and reformat to ensure consistency
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
    
    // Return the original if we can't parse it
    return dateStr;
  };

  // Sidebar component
  const Sidebar = ({
    activeTab,
    setActiveTab,
    toggleDarkMode,
    toggleAssistant,
    sidebarOpen,
    toggleSidebar,
    colors,
  }) => (
    <div
      className={`sidebar ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 md:relative absolute z-40 flex flex-col w-64 h-full p-4 rounded-r-3xl shadow-lg`}
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
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "journal" ? "font-medium" : ""}`}
              onClick={() => setActiveTab("journal")}
              style={{
                background:
                  activeTab === "journal"
                    ? colors.cardHighlight
                    : "transparent",
                color: activeTab === "journal" ? colors.primary : colors.text,
              }}
            >
              <span className="mr-3">
                <CustomIcon type="journal" />
              </span>
              <span>Journal</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "projects" ? "font-medium" : ""}`}
              onClick={() => setActiveTab("projects")}
              style={{
                background:
                  activeTab === "projects"
                    ? colors.cardHighlight
                    : "transparent",
                color: activeTab === "projects" ? colors.primary : colors.text,
              }}
            >
              <span className="mr-3">
                <CustomIcon type="projects" />
              </span>
              <span>Projects</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "focus" ? "font-medium" : ""}`}
              onClick={() => setActiveTab("focus")}
              style={{
                background:
                  activeTab === "focus" ? colors.cardHighlight : "transparent",
                color: activeTab === "focus" ? colors.primary : colors.text,
              }}
            >
              <span className="mr-3">
                <CustomIcon type="focus" />
              </span>
              <span>Focus</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "admin" ? "font-medium" : ""}`}
              onClick={() => setActiveTab("admin")}
              style={{
                background:
                  activeTab === "admin" ? colors.cardHighlight : "transparent",
                color: activeTab === "admin" ? colors.primary : colors.text,
              }}
            >
              <span className="mr-3">
                <CustomIcon type="admin" />
              </span>
              <span>Admin</span>
            </button>
          </li>
          <li>
            <button
              className={`flex items-center w-full p-3 rounded-xl transition-colors ${activeTab === "reflection" ? "font-medium" : ""}`}
              onClick={() => setActiveTab("reflection")}
              style={{
                background:
                  activeTab === "reflection"
                    ? colors.cardHighlight
                    : "transparent",
                color:
                  activeTab === "reflection" ? colors.primary : colors.text,
              }}
            >
              <span className="mr-3">
                <CustomIcon type="reflection" />
              </span>
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
        <span className="mr-2">
          <CustomIcon type="assistant" />
        </span>
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
        {assistantMessages.map((msg) => (
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
                      background:
                        msg.selectedOption === idx
                          ? colors.buttonBg
                          : "transparent",
                      color:
                        msg.selectedOption === idx
                          ? colors.buttonText
                          : colors.primary,
                      border: `1px solid ${colors.primary}`,
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
                <p className="mt-2">
                  Would you like me to add these as steps to your focus task?
                </p>
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
              <span style={{ color: colors.primary }}>Priority:</span> Art
              Exhibition (35% complete)
              <div className="text-xs opacity-70 mt-1">
                Needs attention - Progress stalled for 5 days
              </div>
            </div>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <div>
              <span style={{ color: colors.primary }}>Upcoming:</span> Studio
              rent payment (3 days)
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
      <div
        className="flex h-screen w-full overflow-hidden"
        style={{ background: colors.background, color: colors.text }}
      >
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
          {activeTab === "journal" && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Daily Journal</h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateJournalDate("prev")}
                    className="p-1 rounded-full"
                    style={{ color: colors.primary }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <div className="flex items-center">
                    <span className="mr-2">
                      <CustomIcon type="calendar" />
                    </span>
                    <span>{formatDisplayDate(currentJournalDate)}</span>
                  </div>
                  <button
                    onClick={() => navigateJournalDate("next")}
                    className="p-1 rounded-full"
                    style={{ color: colors.primary }}
                  >
                    <ArrowRight size={18} />
                  </button>
                  <button
                    className="ml-2 p-1 rounded-full"
                    style={{ color: colors.primary }}
                    title="View Analysis"
                    onClick={() => setShowAnalysisModal(true)}
                  >
                    <CustomIcon type="analysis" />
                  </button>
                </div>
              </div>
              <div 
                className="flex-grow overflow-y-auto p-4 rounded-2xl shadow-md mb-4"
                style={{ background: colors.cardBg }}
              >
                {/* Journal entries for current date */}
                {journalEntriesState[getCurrentDateKey()] ? (
                  journalEntriesState[getCurrentDateKey()].map((entry) => (
                    <div 
                      key={entry.id} 
                      className="p-3 mb-3 rounded-xl"
                      style={{ background: colors.cardHighlight }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs opacity-70">{entry.timestamp}</div>
                        <div className="flex items-center gap-2">
                          {entry.type === "voice" && (
                            <button 
                              className="p-1 rounded-full"
                              style={{ color: colors.primary }}
                            >
                              <MessageSquare size={16} />
                            </button>
                          )}
                          <button 
                            className="p-1 rounded-full"
                            style={{ color: colors.primary }}
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            className="p-1 rounded-full"
                            style={{ color: colors.primary }}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm">{entry.content}</p>
                    </div>
                  ))
                ) : (
                  <div 
                    className="flex flex-col items-center justify-center h-full text-center opacity-60"
                  >
                    <CustomIcon type="journal" />
                    <p className="mt-2">No entries for this day yet.</p>
                    <p className="text-sm mt-1">Add your first thought below.</p>
                  </div>
                )}
              </div>
              
              {/* Entry input area */}
              <div 
                className="p-3 rounded-2xl shadow-md"
                style={{ background: colors.cardBg }}
              >
                <div className="flex items-center gap-2">
                  <textarea
                    value={newEntry}
                    onChange={(e) => setNewEntry(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="What's on your mind? Press Enter to save..."
                    className="flex-grow p-3 rounded-xl resize-none"
                    rows={2}
                    style={{ 
                      background: colors.cardHighlight,
                      color: colors.text 
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      className="p-2 rounded-xl"
                      style={{ 
                        background: colors.buttonBg, 
                        color: colors.buttonText 
                      }}
                      onClick={() => {
                        if (newEntry.trim()) {
                          saveJournalEntry();
                        }
                      }}
                    >
                      <CheckCircle size={18} />
                    </button>
                    <button
                      className="p-2 rounded-xl relative"
                      style={{ 
                        background: isRecording ? colors.primary : colors.cardHighlight, 
                        color: isRecording ? colors.buttonText : colors.primary
                      }}
                      onClick={isRecording ? stopRecording : startRecording}
                    >
                      {isRecording ? (
                        <>
                          <div className="absolute -top-8 -right-1 bg-red-500 text-white px-2 py-1 rounded-lg text-xs">
                            {formatRecordingTime(recordingTime)}
                          </div>
                          <X size={18} />
                        </>
                      ) : (
                        <Mic size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Analysis section */}
                {journalAnalysis[getCurrentDateKey()] && (
                  <div 
                    className="mt-3 p-3 rounded-xl text-sm"
                    style={{ background: colors.cardHighlight, color: colors.text }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Daily Insights:</h3>
                      <span className="text-xs opacity-70">
                        {journalAnalysis[getCurrentDateKey()].wordCount} words today
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {journalAnalysis[getCurrentDateKey()].themes.map((theme, idx) => (
                        <span 
                          key={idx} 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ background: colors.primary, color: colors.buttonText }}
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                    <p className="opacity-70 mb-1">
                      Sentiment: {journalAnalysis[getCurrentDateKey()].sentiment}
                    </p>
                    {journalAnalysis[getCurrentDateKey()].actionItems.length > 0 && (
                      <div>
                        <p className="font-medium mt-2">Action Items:</p>
                        <ul className="list-disc pl-5">
                          {journalAnalysis[getCurrentDateKey()].actionItems.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "projects" && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Projects</h2>
                <button
                  className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  style={{ background: colors.buttonBg, color: colors.buttonText }}
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <CustomIcon type="add" />
                  <span>New Project</span>
                </button>
              </div>
              
              <div 
                className="flex-grow overflow-y-auto space-y-4 p-4 rounded-2xl shadow-md"
                style={{ background: colors.cardBg }}
              >
                {projectsState.map(project => (
                  <div 
                    key={project.id} 
                    className="p-4 rounded-xl"
                    style={{ background: colors.cardHighlight }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{project.name}</h3>
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-1 rounded-full text-xs"
                          style={{ 
                            background: project.color, 
                            color: colors.text 
                          }}
                        >
                          {project.priority}
                        </span>
                        <button
                          className="p-1 rounded-full"
                          style={{ color: colors.primary }}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setShowProjectDetailModal(true);
                          }}
                        >
                          <Edit3 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div 
                        className="h-2 rounded-full"
                        style={{ 
                          background: project.color + '40', 
                          width: '100%' 
                        }}
                      >
                        <div 
                          className="h-full rounded-full"
                          style={{ 
                            background: project.color, 
                            width: `${project.progress}%` 
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-sm opacity-70">
                        Deadline: {standardizeDate(project.deadline)}
                      </div>
                      <button
                        className="px-2 py-1 rounded-lg text-xs"
                        style={{ background: colors.primary, color: colors.buttonText }}
                        onClick={() => {
                          // Add a task for this project
                          setSelectedProjectId(project.id);
                          setShowNewTaskModal(true);
                        }}
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                ))}
                
                {projectsState.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-center opacity-70">
                    <CustomIcon type="projects" />
                    <p className="mt-2">No projects yet.</p>
                    <p className="text-sm mt-1">Add your first project to get started.</p>
                  </div>
                )}
              </div>
              
              {/* New Project Modal */}
              {showNewProjectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div 
                    className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
                    style={{ background: colors.cardBg, color: colors.text }}
                  >
                    <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
                      <h2 className="font-bold text-lg">New Project</h2>
                      <button onClick={() => setShowNewProjectModal(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Project Name</label>
                        <input
                          type="text"
                          value={newProject.name}
                          onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Priority</label>
                        <select
                          value={newProject.priority}
                          onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                        >
                          <option value="high">High</option>
                          <option value="medium">Medium</option>
                          <option value="low">Low</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <input
                          type="date"
                          value={newProject.deadline}
                          onChange={(e) => setNewProject({...newProject, deadline: e.target.value})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Color</label>
                        <div className="flex gap-2 flex-wrap">
                          {['#D4A373', '#E9C46A', '#CCD5AE', '#76B947', '#43AA8B', '#4D908E', '#577590'].map(color => (
                            <button
                              key={color}
                              className={`w-8 h-8 rounded-full ${newProject.color === color ? 'ring-2 ring-offset-2' : ''}`}
                              style={{ background: color, ringColor: colors.text }}
                              onClick={() => setNewProject({...newProject, color: color})}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t" style={{ borderColor: colors.cardHighlight }}>
                      <button
                        className="w-full py-2 rounded-xl"
                        style={{ 
                          background: colors.buttonBg, 
                          color: colors.buttonText,
                          opacity: !newProject.name ? 0.5 : 1 
                        }}
                        disabled={!newProject.name}
                        onClick={() => {
                          if (newProject.name) {
                            const projectToAdd = {
                              ...newProject,
                              id: Date.now(),
                              progress: 0,
                            };
                            // Add the project and maintain sort by priority
                            const updatedProjects = [...projectsState, projectToAdd];
                            const sortedProjects = updatedProjects.sort((a, b) => {
                              const priorityOrder = { high: 1, medium: 2, low: 3 };
                              return priorityOrder[a.priority] - priorityOrder[b.priority];
                            });
                            setProjectsState(sortedProjects);
                            setShowNewProjectModal(false);
                            setNewProject({
                              name: '',
                              priority: 'medium',
                              deadline: '',
                              color: '#D4A373'
                            });
                          }
                        }}
                      >
                        Create Project
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Project Detail Modal */}
              {showProjectDetailModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div 
                    className="rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                    style={{ background: colors.cardBg, color: colors.text }}
                  >
                    {(() => {
                      const project = projectsState.find(p => p.id === selectedProjectId);
                      if (!project) return null;
                      
                      return (
                        <>
                          <div className="flex justify-between items-center p-4 border-b" 
                            style={{ borderColor: colors.cardHighlight, background: project.color + '30' }}>
                            <h2 className="font-bold text-lg">{project.name}</h2>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 rounded-full text-xs bg-white bg-opacity-20">
                                {project.priority}
                              </span>
                              <button onClick={() => setShowProjectDetailModal(false)}>
                                <X size={20} />
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex-grow overflow-y-auto">
                            <div className="p-4">
                              <h3 className="font-semibold mb-2">Progress</h3>
                              <div className="flex items-center gap-4">
                                <div className="flex-grow">
                                  <div 
                                    className="h-4 rounded-full"
                                    style={{ 
                                      background: project.color + '40', 
                                      width: '100%' 
                                    }}
                                  >
                                    <div 
                                      className="h-full rounded-full"
                                      style={{ 
                                        background: project.color, 
                                        width: `${project.progress}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                                <div className="font-medium">{project.progress}%</div>
                              </div>
                              
                              <div className="mt-4 flex justify-between items-center">
                                <div>
                                  <label className="block text-sm font-medium mb-1">Update Progress</label>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={editProjectProgress}
                                    onChange={(e) => setEditProjectProgress(parseInt(e.target.value))}
                                    className="w-full"
                                  />
                                </div>
                                <button
                                  className="px-3 py-1 rounded-lg text-sm"
                                  style={{ background: colors.buttonBg, color: colors.buttonText }}
                                  onClick={() => {
                                    setProjectsState(projectsState.map(p => 
                                      p.id === project.id ? {...p, progress: editProjectProgress} : p
                                    ));
                                  }}
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                            
                            <div className="p-4 border-t" style={{ borderColor: colors.cardHighlight }}>
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold">Related Tasks</h3>
                                <button
                                  className="px-2 py-1 rounded-lg text-xs flex items-center gap-1"
                                  style={{ background: colors.primary, color: colors.buttonText }}
                                  onClick={() => {
                                    setShowNewTaskModal(true);
                                    setShowProjectDetailModal(false);
                                  }}
                                >
                                  <CustomIcon type="add" />
                                  <span>Add Task</span>
                                </button>
                              </div>
                              
                              <div className="space-y-2">
                                {priorityTasksState.filter(task => task.projectId === project.id).map(task => (
                                  <div 
                                    key={task.id} 
                                    className="p-3 rounded-xl flex justify-between items-center"
                                    style={{ background: colors.cardHighlight }}
                                  >
                                    <div>
                                      <div className="font-medium">{task.name}</div>
                                      <div className="text-xs opacity-70">Deadline: {standardizeDate(task.deadline)}</div>
                                    </div>
                                    <button
                                      className="p-1 rounded-full"
                                      style={{ color: colors.primary }}
                                      onClick={() => {
                                        // View task details
                                        setSelectedTaskId(task.id);
                                        setShowTaskDetailModal(true);
                                        setShowProjectDetailModal(false);
                                      }}
                                    >
                                      <MoreHorizontal size={16} />
                                    </button>
                                  </div>
                                ))}
                                
                                {priorityTasksState.filter(task => task.projectId === project.id).length === 0 && (
                                  <div className="text-center p-4 opacity-70">
                                    <p>No tasks for this project yet.</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border-t flex justify-between" style={{ borderColor: colors.cardHighlight }}>
                            <button
                              className="px-4 py-2 rounded-xl text-sm"
                              style={{ 
                                background: 'rgba(239, 68, 68, 0.1)', 
                                color: 'rgb(239, 68, 68)' 
                              }}
                              onClick={() => {
                                if (window.confirm('Are you sure you want to delete this project?')) {
                                  setProjectsState(projectsState.filter(p => p.id !== project.id));
                                  setShowProjectDetailModal(false);
                                }
                              }}
                            >
                              Delete Project
                            </button>
                            <button
                              className="px-4 py-2 rounded-xl text-sm"
                              style={{ background: colors.buttonBg, color: colors.buttonText }}
                              onClick={() => setShowProjectDetailModal(false)}
                            >
                              Close
                            </button>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              )}
              
              {/* New Task Modal */}
              {showNewTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div 
                    className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
                    style={{ background: colors.cardBg, color: colors.text }}
                  >
                    <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
                      <h2 className="font-bold text-lg">New Task</h2>
                      <button onClick={() => setShowNewTaskModal(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Task Name</label>
                        <input
                          type="text"
                          value={newTask.name}
                          onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Project</label>
                        <select
                          value={newTask.projectId}
                          onChange={(e) => setNewTask({...newTask, projectId: parseInt(e.target.value)})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                        >
                          {projectsState.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <input
                          type="date"
                          value={newTask.deadline}
                          onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Steps</label>
                        <div className="space-y-2">
                          {newTask.steps.map((step, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={step.description}
                                onChange={(e) => {
                                  const updatedSteps = [...newTask.steps];
                                  updatedSteps[index].description = e.target.value;
                                  setNewTask({...newTask, steps: updatedSteps});
                                }}
                                className="flex-grow p-2 rounded-lg"
                                style={{ background: colors.cardHighlight }}
                              />
                              <button
                                onClick={() => {
                                  setNewTask({
                                    ...newTask, 
                                    steps: newTask.steps.filter((_, i) => i !== index)
                                  });
                                }}
                                className="p-1 rounded-full"
                                style={{ color: colors.primary }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setNewTask({
                                ...newTask,
                                steps: [
                                  ...newTask.steps,
                                  { id: Date.now(), description: '', completed: false }
                                ]
                              });
                            }}
                            className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                            style={{ background: colors.cardHighlight, color: colors.primary }}
                          >
                            <CustomIcon type="add" />
                            <span>Add Step</span>
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border-t" style={{ borderColor: colors.cardHighlight }}>
                      <button
                        className="w-full py-2 rounded-xl"
                        style={{ 
                          background: colors.buttonBg, 
                          color: colors.buttonText,
                          opacity: !newTask.name ? 0.5 : 1 
                        }}
                        disabled={!newTask.name}
                        onClick={() => {
                          if (newTask.name) {
                            const taskToAdd = {
                              ...newTask,
                              id: Date.now(),
                              steps: newTask.steps.filter(step => step.description.trim() !== '')
                            };
                            
                            // Add the task and sort the tasks by project priority
                            const updatedTasks = [...priorityTasksState, taskToAdd];
                            
                            // Sort tasks by the priority of their associated projects
                            const sortedTasks = updatedTasks.sort((a, b) => {
                              const projectA = projectsState.find(p => p.id === a.projectId);
                              const projectB = projectsState.find(p => p.id === b.projectId);
                              
                              if (!projectA || !projectB) return 0;
                              
                              const priorityOrder = { high: 1, medium: 2, low: 3 };
                              return priorityOrder[projectA.priority] - priorityOrder[projectB.priority];
                            });
                            
                            setPriorityTasksState(sortedTasks);
                            setShowNewTaskModal(false);
                            setNewTask({
                              name: '',
                              projectId: selectedProjectId,
                              deadline: '',
                              steps: [{ id: Date.now(), description: '', completed: false }]
                            });
                          }
                        }}
                      >
                        Create Task
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "focus" && (
            <div className="h-full flex flex-col overflow-hidden">
              <h2 className="text-xl font-bold mb-4">Focus Session</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* Timer Section */}
                <div 
                  className="flex flex-col rounded-2xl shadow-md overflow-hidden"
                  style={{ background: colors.cardBg }}
                >
                  <div 
                    className="p-4 border-b text-center"
                    style={{ borderColor: colors.cardHighlight }}
                  >
                    <h3 className="font-semibold">Pomodoro Timer</h3>
                  </div>
                  
                  <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="mb-4 flex gap-2">
                      <button
                        className={`px-3 py-1 rounded-lg text-xs ${timerMode === 'focus' ? 'font-bold' : 'opacity-70'}`}
                        style={{ 
                          background: timerMode === 'focus' ? colors.buttonBg : 'transparent',
                          color: timerMode === 'focus' ? colors.buttonText : colors.text
                        }}
                        onClick={() => {
                          setTimerMode('focus');
                          setTimeRemaining(25 * 60);
                          setTimerActive(false);
                          if (timerInterval) clearInterval(timerInterval);
                          setTimerIntervalId(null);
                        }}
                      >
                        Focus
                      </button>
                      <button
                        className={`px-3 py-1 rounded-lg text-xs ${timerMode === 'break' ? 'font-bold' : 'opacity-70'}`}
                        style={{ 
                          background: timerMode === 'break' ? colors.buttonBg : 'transparent',
                          color: timerMode === 'break' ? colors.buttonText : colors.text
                        }}
                        onClick={() => {
                          setTimerMode('break');
                          setTimeRemaining(5 * 60);
                          setTimerActive(false);
                          if (timerInterval) clearInterval(timerInterval);
                          setTimerIntervalId(null);
                        }}
                      >
                        Break
                      </button>
                    </div>
                    
                    <div 
                      className="text-4xl font-bold mb-4"
                      style={{ color: colors.primary }}
                    >
                      {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:
                      {(timeRemaining % 60).toString().padStart(2, '0')}
                    </div>
                    
                    {/* Duration presets */}
                    <div className="mb-4 flex flex-wrap justify-center gap-2">
                      {[5, 15, 25, 30, 45, 60].map(minutes => (
                        <button
                          key={minutes}
                          className="px-2 py-1 rounded-lg text-xs"
                          style={{ 
                            background: timeRemaining === minutes * 60 ? colors.primary : colors.cardHighlight,
                            color: timeRemaining === minutes * 60 ? colors.buttonText : colors.text
                          }}
                          onClick={() => {
                            setTimeRemaining(minutes * 60);
                            if (timerActive) {
                              clearInterval(timerInterval);
                              setTimerIntervalId(null);
                              setTimerActive(false);
                            }
                          }}
                        >
                          {minutes}m
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        className="px-4 py-2 rounded-xl text-sm"
                        style={{ 
                          background: timerActive ? colors.cardHighlight : colors.buttonBg, 
                          color: timerActive ? colors.text : colors.buttonText 
                        }}
                        onClick={() => {
                          if (timerActive) {
                            // Stop timer
                            clearInterval(timerInterval);
                            setTimerIntervalId(null);
                            setTimerActive(false);
                          } else {
                            // Start timer
                            setTimerActive(true);
                            const intervalId = setInterval(() => {
                              setTimeRemaining(prev => {
                                if (prev <= 1) {
                                  // Time's up
                                  clearInterval(intervalId);
                                  setTimerActive(false);
                                  
                                  // Trigger notification in a real app
                                  // For now, just play a sound
                                  try {
                                    const audio = new Audio('https://cdn.freesound.org/previews/352/352661_5121236-lq.mp3');
                                    audio.play();
                                  } catch (e) {
                                    console.error('Could not play sound:', e);
                                  }
                                  
                                  return 0;
                                }
                                return prev - 1;
                              });
                            }, 1000);
                            setTimerIntervalId(intervalId);
                          }
                        }}
                      >
                        {timerActive ? 'Pause' : 'Start'}
                      </button>
                      <button
                        className="px-3 py-2 rounded-xl text-sm"
                        style={{ background: colors.cardHighlight }}
                        onClick={() => {
                          // Reset timer
                          clearInterval(timerInterval);
                          setTimerIntervalId(null);
                          setTimerActive(false);
                          setTimeRemaining(timerMode === 'focus' ? 25 * 60 : 5 * 60);
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                  
                  {timerActive && (
                    <div 
                      className="p-4 border-t text-center"
                      style={{ borderColor: colors.cardHighlight }}
                    >
                      <p className="text-sm opacity-80">
                        {timerMode === 'focus' 
                          ? 'Focus on your task. Stay present and avoid distractions.' 
                          : 'Take a break. Stretch, breathe, or get some water.'}
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Current Task Section */}
                <div className="flex flex-col space-y-4">
                  <div 
                    className="flex-grow rounded-2xl shadow-md overflow-hidden"
                    style={{ background: colors.cardBg }}
                  >
                    <div 
                      className="p-4 border-b"
                      style={{ borderColor: colors.cardHighlight }}
                    >
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Current Task</h3>
                        <div className="relative group">
                          <button
                            className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                            style={{ background: colors.cardHighlight, color: colors.primary }}
                            onClick={() => {
                              // Toggle task selector dropdown
                              document.getElementById('task-selector-dropdown').classList.toggle('hidden');
                            }}
                          >
                            <span>Select Task</span>
                            <ArrowRight size={16} />
                          </button>
                          
                          {/* Task selector dropdown */}
                          <div 
                            id="task-selector-dropdown"
                            className="absolute right-0 mt-1 z-10 w-64 overflow-hidden rounded-xl shadow-lg hidden"
                            style={{ background: colors.cardBg }}
                          >
                            <div className="p-2 max-h-48 overflow-y-auto">
                              {priorityTasksState.map(task => {
                                const project = projectsState.find(p => p.id === task.projectId);
                                return (
                                  <button
                                    key={task.id}
                                    className="w-full text-left p-2 rounded-lg mb-1 flex items-center gap-2"
                                    style={{ 
                                      background: task.id === currentFocusTaskId ? colors.cardHighlight : 'transparent',
                                      fontWeight: task.id === currentFocusTaskId ? 'bold' : 'normal'
                                    }}
                                    onClick={() => {
                                      setCurrentFocusTaskId(task.id);
                                      document.getElementById('task-selector-dropdown').classList.add('hidden');
                                    }}
                                  >
                                    <span 
                                      className="w-3 h-3 rounded-full flex-shrink-0"
                                      style={{ background: project ? project.color : colors.primary }}
                                    />
                                    <span className="truncate">{task.name}</span>
                                  </button>
                                );
                              })}
                              
                              {priorityTasksState.length === 0 && (
                                <div className="p-2 text-center text-sm opacity-70">
                                  No tasks available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Current task info */}
                      {(() => {
                        const currentTask = priorityTasksState.find(task => task.id === currentFocusTaskId);
                        if (currentTask) {
                          const project = projectsState.find(p => p.id === currentTask.projectId);
                          return (
                            <div className="mt-2 flex items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full"
                                style={{ background: project ? project.color : colors.primary }}
                              />
                              <span className="truncate text-sm">{currentTask.name}</span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                    
                    {(() => {
                      const currentTask = priorityTasksState.find(task => task.id === currentFocusTaskId);
                      if (!currentTask) {
                        return (
                          <div className="p-8 text-center opacity-70">
                            <p>No tasks available.</p>
                            <p className="text-sm mt-2">Add tasks in the Projects tab to get started.</p>
                          </div>
                        );
                      }
                      
                      const project = projectsState.find(p => p.id === currentTask.projectId);
                      
                      return (
                        <div className="p-4">
                          <div className="mb-4">
                            <h4 className="font-bold text-lg">{currentTask.name}</h4>
                            <div className="flex items-center text-sm opacity-70 mt-1">
                              <span>Project: </span>
                              <span 
                                className="inline-block w-3 h-3 rounded-full mx-1"
                                style={{ background: project ? project.color : colors.primary }}
                              />
                              <span>{project ? project.name : 'Unknown Project'}</span>
                            </div>
                            <div className="text-sm opacity-70">
                              Deadline: {standardizeDate(currentTask.deadline)}
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <h5 className="font-medium mb-2">Steps</h5>
                            <ul className="space-y-2">
                              {currentTask.steps.map(step => (
                                <li 
                                  key={step.id} 
                                  className="flex items-center p-2 rounded-lg"
                                  style={{ background: colors.cardHighlight }}
                                >
                                  <button
                                    className={`mr-3 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                      step.completed 
                                        ? 'bg-green-500 text-white' 
                                        : 'border border-gray-400'
                                    }`}
                                    onClick={() => {
                                      // Toggle step completion
                                      setPriorityTasksState(priorityTasksState.map(task => 
                                        task.id === currentTask.id 
                                          ? {
                                              ...task,
                                              steps: task.steps.map(s => 
                                                s.id === step.id 
                                                  ? {...s, completed: !s.completed} 
                                                  : s
                                              )
                                            } 
                                          : task
                                      ));
                                    }}
                                  >
                                    {step.completed && <CheckCircle size={14} />}
                                  </button>
                                  <span 
                                    className={step.completed ? 'line-through opacity-50' : ''}
                                  >
                                    {step.description}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="mt-6 flex justify-between">
                            <button
                              className="px-4 py-2 rounded-xl text-sm"
                              style={{ 
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: 'rgb(239, 68, 68)'
                              }}
                              onClick={() => {
                                if (window.confirm('Mark this task as complete?')) {
                                  // In a real app, this would move to completed tasks
                                  // For now, we'll just toggle all steps as completed
                                  setPriorityTasksState(priorityTasksState.map(task => 
                                    task.id === currentTask.id 
                                      ? {
                                          ...task,
                                          steps: task.steps.map(s => ({...s, completed: true}))
                                        } 
                                      : task
                                  ));
                                }
                              }}
                            >
                              Complete Task
                            </button>
                            <button
                              className="px-4 py-2 rounded-xl text-sm"
                              style={{ background: colors.buttonBg, color: colors.buttonText }}
                              onClick={() => {
                                // Start a focus session
                                setTimerMode('focus');
                                setTimeRemaining(25 * 60);
                                setTimerActive(true);
                                
                                const intervalId = setInterval(() => {
                                  setTimeRemaining(prev => {
                                    if (prev <= 1) {
                                      clearInterval(intervalId);
                                      setTimerActive(false);
                                      return 0;
                                    }
                                    return prev - 1;
                                  });
                                }, 1000);
                                setTimerIntervalId(intervalId);
                              }}
                            >
                              Focus on this
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <div 
                    className="rounded-2xl shadow-md"
                    style={{ background: colors.cardBg }}
                  >
                    <div 
                      className="p-4 border-b"
                      style={{ borderColor: colors.cardHighlight }}
                    >
                      <h3 className="font-semibold">Focus Notes</h3>
                    </div>
                    <div className="p-4">
                      <textarea
                        placeholder="Take notes during your focus session..."
                        className="w-full p-3 rounded-xl resize-none"
                        rows={3}
                        style={{ background: colors.cardHighlight }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "admin" && (
            <div className="h-full flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Admin Tasks</h2>
                <button
                  className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  style={{ background: colors.buttonBg, color: colors.buttonText }}
                  onClick={() => setShowNewAdminTaskModal(true)}
                >
                  <CustomIcon type="add" />
                  <span>New Task</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div 
                  className="p-3 rounded-xl shadow-md flex items-center justify-between"
                  style={{ background: colors.cardBg }}
                >
                  <div>
                    <h3 className="text-sm opacity-70">Total Tasks</h3>
                    <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {adminTasksState.length}
                    </div>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: colors.cardHighlight }}
                  >
                    <CustomIcon type="admin" />
                  </div>
                </div>
                
                <div 
                  className="p-3 rounded-xl shadow-md flex items-center justify-between"
                  style={{ background: colors.cardBg }}
                >
                  <div>
                    <h3 className="text-sm opacity-70">Completed</h3>
                    <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {adminTasksState.filter(task => task.completed).length}
                    </div>
                  </div>
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: colors.cardHighlight }}
                  >
                    <CheckCircle />
                  </div>
                </div>
              </div>
              
              <div 
                className="flex-grow overflow-y-auto rounded-2xl shadow-md"
                style={{ background: colors.cardBg }}
              >
                <div 
                  className="p-4 border-b"
                  style={{ borderColor: colors.cardHighlight }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Current Tasks</h3>
                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-1 rounded-lg text-xs`}
                        style={{ 
                          background: colors.cardHighlight, 
                          color: colors.primary 
                        }}
                        onClick={() => {
                          // Sort by deadline
                          setAdminTasksState([...adminTasksState].sort((a, b) => {
                            return new Date(a.deadline) - new Date(b.deadline);
                          }));
                        }}
                      >
                        Sort by Deadline
                      </button>
                      <button
                        className={`px-2 py-1 rounded-lg text-xs`}
                        style={{ 
                          background: colors.cardHighlight, 
                          color: colors.primary 
                        }}
                        onClick={() => {
                          // Toggle completed tasks visibility
                          setShowCompletedTasks(!showCompletedTasks);
                        }}
                      >
                        {showCompletedTasks ? 'Hide Completed' : 'Show All'}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y" style={{ borderColor: colors.cardHighlight }}>
                  {adminTasksState
                    .filter(task => showCompletedTasks || !task.completed)
                    .map(task => (
                    <div 
                      key={task.id} 
                      className="p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3 flex-grow">
                        <button
                          className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                            task.completed 
                              ? 'bg-green-500 text-white' 
                              : 'border border-gray-400'
                          }`}
                          onClick={() => {
                            // Toggle task completion
                            setAdminTasksState(adminTasksState.map(t => 
                              t.id === task.id ? {...t, completed: !t.completed} : t
                            ));
                          }}
                        >
                          {task.completed && <CheckCircle size={16} />}
                        </button>
                        <div className={task.completed ? 'line-through opacity-50' : ''}>
                          <div className="font-medium">{task.description}</div>
                          <div className="text-sm opacity-70">
                            Due: {standardizeDate(task.deadline)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          className="p-1 rounded-full"
                          style={{ color: colors.primary }}
                          onClick={() => {
                            // Delete task
                            if (window.confirm('Delete this admin task?')) {
                              setAdminTasksState(adminTasksState.filter(t => t.id !== task.id));
                            }
                          }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {adminTasksState.length === 0 && (
                    <div className="p-8 text-center opacity-70">
                      <p>No admin tasks yet.</p>
                      <p className="text-sm mt-2">Add your first admin task to get started.</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* New Admin Task Modal */}
              {showNewAdminTaskModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div 
                    className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
                    style={{ background: colors.cardBg, color: colors.text }}
                  >
                    <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
                      <h2 className="font-bold text-lg">New Admin Task</h2>
                      <button onClick={() => setShowNewAdminTaskModal(false)}>
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Task Description</label>
                        <input
                          type="text"
                          value={newAdminTask.description}
                          onChange={(e) => setNewAdminTask({...newAdminTask, description: e.target.value})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                          placeholder="e.g., Pay studio rent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Deadline</label>
                        <input
                          type="date"
                          value={newAdminTask.deadline}
                          onChange={(e) => setNewAdminTask({...newAdminTask, deadline: e.target.value})}
                          className="w-full p-2 rounded-lg"
                          style={{ background: colors.cardHighlight }}
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 border-t" style={{ borderColor: colors.cardHighlight }}>
                      <button
                        className="w-full py-2 rounded-xl"
                        style={{ 
                          background: colors.buttonBg, 
                          color: colors.buttonText,
                          opacity: !newAdminTask.description ? 0.5 : 1 
                        }}
                        disabled={!newAdminTask.description}
                        onClick={() => {
                          if (newAdminTask.description) {
                            const taskToAdd = {
                              ...newAdminTask,
                              id: Date.now()
                            };
                            setAdminTasksState([...adminTasksState, taskToAdd]);
                            setShowNewAdminTaskModal(false);
                            setNewAdminTask({
                              description: '',
                              deadline: '',
                              completed: false
                            });
                          }
                        }}
                      >
                        Add Task
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "reflection" && (
            <div className="h-full flex flex-col overflow-hidden">
              <h2 className="text-xl font-bold mb-4">Reflection Practice</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                {/* Current Reflection Prompt */}
                <div 
                  className="flex flex-col rounded-2xl shadow-md"
                  style={{ background: colors.cardBg }}
                >
                  <div 
                    className="p-4 border-b"
                    style={{ borderColor: colors.cardHighlight }}
                  >
                    <h3 className="font-semibold">Current Prompt</h3>
                  </div>
                  
                  <div className="flex-grow p-4 flex flex-col">
                    <div 
                      className="p-4 rounded-xl mb-4"
                      style={{ background: colors.cardHighlight }}
                    >
                      <p className="text-lg" style={{ color: colors.primary }}>
                        {reflectionPrompts[currentPromptIndex]}
                      </p>
                    </div>
                    
                    <textarea
                      value={reflectionContent}
                      onChange={(e) => setReflectionContent(e.target.value)}
                      placeholder="Write your reflection here..."
                      className="flex-grow w-full p-3 rounded-xl resize-none mb-4"
                      style={{ background: colors.cardHighlight }}
                    />
                    
                    <div className="flex justify-between">
                      <button
                        onClick={nextReflectionPrompt}
                        className="px-4 py-2 rounded-xl text-sm"
                        style={{ 
                          background: colors.cardHighlight, 
                          color: colors.primary 
                        }}
                      >
                        <ArrowRight size={16} className="inline mr-1" /> Next Prompt
                      </button>
                      
                      <button
                        onClick={() => {
                          if (reflectionContent.trim()) {
                            // Save the reflection
                            setReflectionSaved([
                              ...reflectionSaved,
                              {
                                id: Date.now(),
                                date: new Date().toISOString(),
                                prompt: reflectionPrompts[currentPromptIndex],
                                content: reflectionContent,
                              }
                            ]);
                            
                            // Clear the input but stay on same prompt
                            setReflectionContent('');
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-sm"
                        style={{ 
                          background: colors.buttonBg, 
                          color: colors.buttonText,
                          opacity: !reflectionContent.trim() ? 0.5 : 1
                        }}
                        disabled={!reflectionContent.trim()}
                      >
                        Save Reflection
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Saved Reflections */}
                <div 
                  className="flex flex-col rounded-2xl shadow-md"
                  style={{ background: colors.cardBg }}
                >
                  <div 
                    className="p-4 border-b"
                    style={{ borderColor: colors.cardHighlight }}
                  >
                    <h3 className="font-semibold">Your Reflections</h3>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto">
                    {reflectionSaved.length > 0 ? (
                      <div className="divide-y" style={{ borderColor: colors.cardHighlight }}>
                        {reflectionSaved.map((reflection) => (
                          <div key={reflection.id} className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div 
                                className="text-xs px-2 py-1 rounded-full"
                                style={{ background: colors.cardHighlight }}
                              >
                                {new Date(reflection.date).toLocaleDateString()}
                              </div>
                              <button
                                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                                onClick={() => {
                                  if (window.confirm('Delete this reflection?')) {
                                    setReflectionSaved(reflectionSaved.filter(r => r.id !== reflection.id));
                                  }
                                }}
                              >
                                <X size={14} />
                              </button>
                            </div>
                            <div 
                              className="italic text-sm mb-2 opacity-70"
                            >
                              {reflection.prompt}
                            </div>
                            <p className="text-sm whitespace-pre-line">{reflection.content}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-70">
                        <CustomIcon type="reflection" />
                        <p className="mt-2">No reflections saved yet.</p>
                        <p className="text-sm mt-1">Your reflections will appear here after you save them.</p>
                      </div>
                    )}
                  </div>
                  
                  {reflectionSaved.length > 0 && (
                    <div 
                      className="p-4 border-t"
                      style={{ borderColor: colors.cardHighlight }}
                    >
                      <button
                        className="w-full py-2 rounded-xl text-sm"
                        style={{ background: colors.cardHighlight, color: colors.primary }}
                        onClick={() => {
                          // This would export reflections in a real app
                          alert('In a real app, this would export your reflections to a file.');
                        }}
                      >
                        Export Reflections
                      </button>
                    </div>
                  )}
                </div>
              </div>
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
        
        {/* Analysis Modal */}
        {showAnalysisModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div 
              className="rounded-2xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col"
              style={{ background: colors.cardBg, color: colors.text }}
            >
              <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
                <h2 className="font-bold text-lg">Journal Analysis</h2>
                <button onClick={() => setShowAnalysisModal(false)}>
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-4">
                {/* Determine if we're on the last day of the month for monthly wrap-up */}
                {new Date(currentJournalDate.getFullYear(), currentJournalDate.getMonth() + 1, 0).getDate() === currentJournalDate.getDate() ? (
                  // Monthly wrap-up view
                  <div>
                    <div className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>
                      Monthly Wrap-Up: {currentJournalDate.toLocaleString('default', { month: 'long' })} {currentJournalDate.getFullYear()}
                    </div>
                    
                    {monthlyWrapUps[getCurrentDateKey()] ? (
                      <>
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Key Themes</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {monthlyWrapUps[getCurrentDateKey()].themes.map((theme, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1 rounded-full text-sm"
                                style={{ background: colors.primary, color: colors.buttonText }}
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="mb-4 p-3 rounded-xl" style={{ background: colors.cardHighlight }}>
                          <h3 className="font-medium mb-2">Monthly Insights</h3>
                          <p>{monthlyWrapUps[getCurrentDateKey()].insights}</p>
                        </div>
                        
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Overall Progress</h3>
                          <div className="h-4 w-full rounded-full overflow-hidden" style={{ background: colors.cardHighlight }}>
                            <div 
                              className="h-full rounded-full"
                              style={{ 
                                background: colors.primary, 
                                width: `${monthlyWrapUps[getCurrentDateKey()].progress}%` 
                              }}
                            />
                          </div>
                          <div className="text-right text-sm mt-1">
                            {monthlyWrapUps[getCurrentDateKey()].progress}% productive days
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-xl" style={{ background: colors.cardHighlight }}>
                            <h3 className="font-medium mb-2">Blockers Identified</h3>
                            <ul className="list-disc pl-5">
                              {monthlyWrapUps[getCurrentDateKey()].blockers.map((item, idx) => (
                                <li key={idx} className="mb-1">{item}</li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="p-3 rounded-xl" style={{ background: colors.cardHighlight }}>
                            <h3 className="font-medium mb-2">Recommendations</h3>
                            <ul className="list-disc pl-5">
                              {monthlyWrapUps[getCurrentDateKey()].recommendations.map((item, idx) => (
                                <li key={idx} className="mb-1">{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-8 opacity-70">
                        <p>No monthly wrap-up data available yet.</p>
                        <p className="text-sm mt-2">Keep journaling throughout the month to generate insights!</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular daily analysis view
                  <div>
                    <div className="text-lg font-semibold mb-4">
                      Daily Analysis: {formatDisplayDate(currentJournalDate)}
                    </div>
                    
                    {journalAnalysisState[getCurrentDateKey()] ? (
                      <>
                        <div className="mb-4">
                          <h3 className="font-medium mb-2">Detected Themes</h3>
                          <div className="flex flex-wrap gap-2">
                            {journalAnalysisState[getCurrentDateKey()].themes.map((theme, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1 rounded-full text-sm"
                                style={{ background: colors.primary, color: colors.buttonText }}
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="p-3 rounded-xl" style={{ background: colors.cardHighlight }}>
                            <h3 className="font-medium mb-2">Sentiment Analysis</h3>
                            <p>{journalAnalysisState[getCurrentDateKey()].sentiment}</p>
                          </div>
                          
                          <div className="p-3 rounded-xl" style={{ background: colors.cardHighlight }}>
                            <h3 className="font-medium mb-2">Statistics</h3>
                            <p>{journalAnalysisState[getCurrentDateKey()].wordCount} words written today</p>
                            <p>{journalEntriesState[getCurrentDateKey()]?.length || 0} entries recorded</p>
                          </div>
                        </div>
                        
                        {journalAnalysisState[getCurrentDateKey()].actionItems.length > 0 && (
                          <div className="mb-4">
                            <h3 className="font-medium mb-2">Suggested Action Items</h3>
                            <div className="p-3 rounded-xl" style={{ background: colors.cardHighlight }}>
                              <ul className="list-disc pl-5">
                                {journalAnalysisState[getCurrentDateKey()].actionItems.map((item, idx) => (
                                  <li key={idx} className="mb-1">{item}</li>
                                ))}
                              </ul>
                              <div className="mt-3 flex justify-end">
                                <button
                                  className="px-3 py-1 rounded-lg text-sm"
                                  style={{ background: colors.buttonBg, color: colors.buttonText }}
                                  onClick={() => {
                                    // Add action items to tasks in a real implementation
                                    // For now we just close the modal
                                    setShowAnalysisModal(false);
                                  }}
                                >
                                  Add to Tasks
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center p-8 opacity-70">
                        <p>No analysis data available for this day.</p>
                        <p className="text-sm mt-2">Start journaling to generate insights!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t" style={{ borderColor: colors.cardHighlight }}>
                <button
                  className="w-full py-2 rounded-xl"
                  style={{ background: colors.buttonBg, color: colors.buttonText }}
                  onClick={() => setShowAnalysisModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};
export default MindflowApp;

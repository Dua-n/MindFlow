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
import {
  JournalPage,
  FocusPage,
  ProjectsPage,
  AdminPage,
  ReflectionPage,
} from "./pages";
import Assistant from './components/Assistant';
// Journal Entries
const initialJournalEntries = {};
const journalAnalysis = {};

const projects = [];

const priorityTasks = [];

const adminTasks = [];

// Initial assistant messages
const initialAssistantMessages = [];

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
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
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

const standardizeDate = (dateStr) => {
  if (!dateStr) return "No deadline";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

// Check if a deadline is within 3 days
const isDeadlineNear = (deadlineStr) => {
  if (!deadlineStr) return false;
  
  const deadline = new Date(deadlineStr);
  const today = new Date();
  
  // Set both dates to midnight for accurate day comparison
  deadline.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  // Calculate difference in days
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Return true if deadline is within 3 days
  return diffDays >= 0 && diffDays <= 3;
};

// Get color based on priority
const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#EF4444'; // Red
    case 'medium':
      return '#F59E0B'; // Amber
    case 'low':
      return '#10B981'; // Green
    default:
      return '#6B7280'; // Gray
  }
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
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [editProjectProgress, setEditProjectProgress] = useState(0);
  const [newProject, setNewProject] = useState({
    name: '',
    priority: 'medium',
    deadline: '',
    color: '#D4A373',
    tasks: [{ 
      id: Date.now(), 
      name: '', 
      deadline: '', 
      priority: 'medium',
      notes: '',
      steps: [{ id: Date.now(), description: '', completed: false }]
    }]
  });
  
  // Task state
  const [priorityTasksState, setPriorityTasksState] = useState(priorityTasks);
  const [adminTasksState, setAdminTasksState] = useState([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    projectId: null,
    deadline: '',
    priority: 'medium',
    notes: '',
    steps: [{ id: Date.now(), description: '', completed: false }]
  });
  
  // Focus timer state
  const [timerActive, setTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [timerMode, setTimerMode] = useState('focus'); // 'focus' or 'break'
  const [timerInterval, setTimerIntervalId] = useState(null);
  
  // Admin tasks state
  const [showCompletedTasks, setShowCompletedTasks] = useState(false);
  const [showNewAdminTaskModal, setShowNewAdminTaskModal] = useState(false);
  const [newAdminTask, setNewAdminTask] = useState({
    description: '',
    deadline: '',
    completed: false
  });

  const [assistantMessages, setAssistantMessages] = useState(initialAssistantMessages);
  
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
        dangerBg: "#7F1D1D",
        dangerText: "#FCA5A5",
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
        dangerBg: "#FEE2E2",
        dangerText: "#B91C1C",
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

  // Add a function to start a focus session on a specific task
  const startFocusSession = (taskId) => {
    // Set the current focus task
    setCurrentFocusTaskId(taskId);
    
    // Switch to the focus tab
    setActiveTab("focus");
    
    // Start the timer
                          setTimerMode('focus');
                          setTimeRemaining(25 * 60);
    setTimerActive(true);
    
    // Clear any existing timer
    if (timerInterval) {
                              clearInterval(timerInterval);
    }
    
    // Start a new timer
                            const intervalId = setInterval(() => {
                              setTimeRemaining(prev => {
                                if (prev <= 1) {
                                  clearInterval(intervalId);
                                  setTimerActive(false);
                                  
          // Play a sound when timer ends
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
  };

  // Update project progress based on task completion
  const updateProjectProgress = (projectId, forceValue = null) => {
    // If a specific value is provided, use that
    if (forceValue !== null) {
      setProjectsState(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { ...project, progress: forceValue } 
            : project
        )
      );
      return;
    }
    
    // Otherwise calculate based on tasks
    const projectTasks = priorityTasksState.filter(task => task.projectId === projectId);
    
    // If there are no tasks, progress is 0%
    if (projectTasks.length === 0) {
      setProjectsState(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { ...project, progress: 0 } 
            : project
        )
      );
      return;
    }
    
    // Calculate based on completed tasks
    const completedTasks = projectTasks.filter(task => task.completed).length;
    
    // Calculate based on task steps for incomplete tasks
    let stepProgress = 0;
    let totalSteps = 0;
    
    projectTasks.forEach(task => {
      if (!task.completed && task.steps && task.steps.length > 0) {
        const taskSteps = task.steps.length;
        const completedSteps = task.steps.filter(step => step.completed).length;
        stepProgress += completedSteps;
        totalSteps += taskSteps;
      }
    });
    
    // Calculate overall progress
    const taskProgressPercentage = (completedTasks / projectTasks.length) * 100;
    
    // If there are steps to consider, blend the progress calculation
    let progress;
    if (totalSteps > 0) {
      const stepProgressPercentage = (stepProgress / totalSteps) * 
        ((projectTasks.length - completedTasks) / projectTasks.length) * 100;
      progress = Math.round(taskProgressPercentage + stepProgressPercentage);
    } else {
      progress = Math.round(taskProgressPercentage);
    }
    
    // Update the project progress
    setProjectsState(prevProjects => {
      const updatedProjects = prevProjects.map(project => 
        project.id === projectId 
          ? { ...project, progress } 
          : project
      );
      
      // Update localStorage
      localStorage.setItem('projects', JSON.stringify(updatedProjects));
      
      return updatedProjects;
    });
  };
  
  // Handle task updates from any component
  const handleTaskUpdate = useCallback((updatedTask) => {
    // Update the task in the state
    setPriorityTasksState(prevTasks => 
      prevTasks.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    
    // Update project progress if task is part of a project
    if (updatedTask.projectId) {
      updateProjectProgress(updatedTask.projectId);
    }
  }, [updateProjectProgress, setPriorityTasksState]);
  
  // Handle task creation
  const handleTaskCreate = useCallback((newTask) => {
    // Add the new task to the priorityTasksState
    setPriorityTasksState(prevTasks => {
      const updatedTasks = [...prevTasks, newTask];
      
      // Update localStorage
      localStorage.setItem('priorityTasks', JSON.stringify(updatedTasks));
      
      return updatedTasks;
    });
    
    // If the task belongs to a project, update the project progress
    if (newTask.projectId) {
      // Find the project
      const project = projectsState.find(p => p.id === newTask.projectId);
      if (project) {
        // Calculate new progress based on all tasks in this project
        updateProjectProgress(newTask.projectId);
      }
    }
    
    // Return the created task ID for potential use
    return newTask.id;
  }, [updateProjectProgress, setPriorityTasksState, projectsState]);
  
  // Handle task deletion
  const handleTaskDelete = useCallback((taskId) => {
    // Get the task to delete
    const taskToDelete = priorityTasksState.find(task => task.id === taskId);
    if (!taskToDelete) return;
    
    // Store the project ID before deleting
    const projectId = taskToDelete.projectId;
    
    // Remove the task
    setPriorityTasksState(prevTasks => 
      prevTasks.filter(task => task.id !== taskId)
    );
    
    // Update project progress if task was part of a project
    if (projectId) {
      updateProjectProgress(projectId);
    }
    
    // If this was the current focus task, select a new one
    if (currentFocusTaskId === taskId) {
      // Find the highest priority incomplete task
      const remainingTasks = priorityTasksState.filter(task => task.id !== taskId);
      
      if (remainingTasks.length > 0) {
        const highPriorityTasks = remainingTasks.filter(task => 
          task.priority === 'high' && !task.completed
        );
        
        if (highPriorityTasks.length > 0) {
          // Sort by deadline (closest first)
          const sortedTasks = [...highPriorityTasks].sort((a, b) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline) - new Date(b.deadline);
          });
          
          setCurrentFocusTaskId(sortedTasks[0].id);
        } else {
          // If no high priority tasks, just use the first task
          setCurrentFocusTaskId(remainingTasks[0].id);
        }
      } else {
        setCurrentFocusTaskId(null);
      }
    }
  }, [priorityTasksState, currentFocusTaskId, updateProjectProgress, setCurrentFocusTaskId, setPriorityTasksState]);

  // Handle new messages from the user
  const handleNewMessage = useCallback((message, type = 'user') => {
    // If this is a user message
    if (type === 'user') {
      const userMessage = {
        id: Date.now(),
        type: 'user',
        message,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        })
      };
      
      setAssistantMessages(prev => [...prev, userMessage]);
      
      // If we're using the built-in responses (not AI), process them here
      if (!import.meta.env.VITE_OPENROUTER_API_KEY) {
        processBuiltInResponses(message);
      }
      // If using AI, the Assistant component will handle the API call
    } 
    // If this is an assistant message (from AI)
    else if (type === 'assistant') {
      const assistantMessage = {
        id: Date.now(),
        type: 'assistant',
        message,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        options: extractOptions(message)
      };
      
      setAssistantMessages(prev => [...prev, assistantMessage]);
    }
  }, []);
  
  // Extract potential options from AI response
  const extractOptions = (message) => {
    // Look for numbered or bulleted lists that might be options
    const optionRegex = /(?:\d+\.\s|\*\s|\-\s)(.*?)(?=\n\d+\.\s|\n\*\s|\n\-\s|$)/g;
    const matches = [...message.matchAll(optionRegex)];
    
    if (matches.length >= 2 && matches.length <= 5) {
      return matches.map(match => match[1].trim());
    }
    
    // Look for questions that might suggest options
    if (message.includes('?') && (
        message.includes('would you like') || 
        message.includes('do you want') || 
        message.includes('should I')
      )) {
      return ["Yes", "No", "Tell me more"];
    }
    
    return null;
  };
  
  // Process built-in responses (used as fallback if AI is not configured)
  const processBuiltInResponses = (message) => {
    let response = null;
    const lowerMessage = message.toLowerCase();
    
    // Journal-related queries
    if (lowerMessage.includes('journal') || lowerMessage.includes('mood') || lowerMessage.includes('feeling')) {
      const today = new Date().toISOString().split('T')[0];
      const recentEntries = journalAnalysis[today];
      
      if (recentEntries) {
        response = {
          id: Date.now() + 1,
          type: 'assistant',
          message: `Based on your recent journal entries, your mood seems ${recentEntries.sentiment}. The main themes are: ${recentEntries.themes.join(', ')}. Would you like to focus on any of these areas?`,
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          options: [...recentEntries.themes, "Not now"],
          selectedOption: null,
          expanded: false
        };
      }
    }
    // Project and task queries
    else if (lowerMessage.includes('exhibition') || lowerMessage.includes('gallery')) {
      const project = projectsState.find(p => p.name === "Art Exhibition");
      const projectTasks = priorityTasksState.filter(t => t.projectId === project.id);
      const incompleteTasks = projectTasks.filter(t => !t.completed);
      
      response = {
        id: Date.now() + 1,
        type: 'assistant',
        message: `The Art Exhibition project is at ${project.progress}% completion. You have ${incompleteTasks.length} pending tasks. Would you like to:`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        options: ["See pending tasks", "Start focus session", "Add new task", "View project details"],
        selectedOption: null,
        expanded: false,
        context: { projectId: project.id, tasks: incompleteTasks }
      };
    }
    // Deadline queries
    else if (lowerMessage.includes('deadline') || lowerMessage.includes('due')) {
      const allItems = [...projectsState, ...adminTasksState, ...priorityTasksState];
      const upcomingDeadlines = allItems
        .filter(item => item.deadline && isDeadlineNear(item.deadline))
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      
      if (upcomingDeadlines.length > 0) {
        response = {
          id: Date.now() + 1,
          type: 'assistant',
          message: "Here are your upcoming deadlines. Would you like to take action on any of these?",
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          }),
          deadlines: upcomingDeadlines.map(item => ({
            name: item.name || item.description,
            deadline: standardizeDate(item.deadline),
            id: item.id,
            type: item.projectId ? 'task' : item.description ? 'admin' : 'project'
          }))
        };
      }
    }
    // Progress and productivity queries
    else if (lowerMessage.includes('progress') || lowerMessage.includes('productivity')) {
      const highPriorityProjects = projectsState.filter(p => p.priority === 'high');
      const completedTasks = priorityTasksState.filter(t => t.completed).length;
      const totalTasks = priorityTasksState.length;
      
      response = {
        id: Date.now() + 1,
        type: 'assistant',
        message: `You've completed ${completedTasks} out of ${totalTasks} tasks (${Math.round((completedTasks/totalTasks) * 100)}%). Here's a summary of your high-priority projects:`,
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        projects: highPriorityProjects.map(p => ({
          name: p.name,
          progress: p.progress,
          deadline: standardizeDate(p.deadline)
        })),
        options: ["Start focus session", "View all projects", "Add new task"]
      };
    }
    // Help or general queries
    else {
      response = {
        id: Date.now() + 1,
        type: 'assistant',
        message: "I can help you with various tasks. What would you like to do?",
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        options: [
          "Check project status",
          "View deadlines",
          "Start focus session",
          "Journal insights",
          "Task management"
        ]
      };
    }
    
    if (response) {
      setTimeout(() => {
        setAssistantMessages(prev => [...prev, response]);
      }, 500);
    }
  };

  // Handle option selection in messages
  const handleOptionSelect = useCallback((messageId, optionIndex) => {
    setAssistantMessages(prev => {
      const updatedMessages = prev.map(msg => {
        if (msg.id === messageId) {
          const updatedMsg = {
            ...msg,
            selectedOption: optionIndex,
            expanded: true
          };
          
          // Handle specific option selections
          if (msg.context?.projectId) {
            switch (msg.options[optionIndex]) {
              case "See pending tasks":
                setTimeout(() => {
                  setAssistantMessages(current => [...current, {
                    id: Date.now(),
                    type: 'assistant',
                    message: "Here are the pending tasks for the project:",
                    timestamp: new Date().toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }),
                    taskList: msg.context.tasks.map(task => ({
                      name: task.name,
                      deadline: standardizeDate(task.deadline),
                      steps: task.steps
                    })),
                    options: ["Start working on a task", "Add new task"]
                  }]);
                }, 500);
                break;
              case "Start focus session":
                if (msg.context.tasks.length > 0) {
                  const nextTask = msg.context.tasks[0];
                  startFocusSession(nextTask.id);
                }
                break;
              case "Add new task":
                setNewTask({
                  ...newTask,
                  projectId: msg.context.projectId
                });
                setShowNewTaskModal(true);
                break;
            }
          } else if (msg.deadlines) {
            const selectedDeadline = msg.deadlines[optionIndex];
            if (selectedDeadline) {
              switch(selectedDeadline.type) {
                case 'task':
                  startFocusSession(selectedDeadline.id);
                  break;
                case 'project':
                  setSelectedProjectId(selectedDeadline.id);
                  setActiveTab('projects');
                  break;
                case 'admin':
                  setActiveTab('admin');
                  break;
              }
            }
          }
          
          return updatedMsg;
        }
        return msg;
      });
      
      return updatedMessages;
    });
  }, [startFocusSession, setActiveTab, setSelectedProjectId, newTask, setNewTask, setShowNewTaskModal]);

  // Get system overview data
  const getSystemOverview = useCallback(() => {
    // Find highest priority project with lowest progress
    const priorityProject = projectsState
      .filter(p => p.priority === 'high')
      .sort((a, b) => a.progress - b.progress)[0];
    
    // Find nearest deadline
    const upcomingDeadlines = [...projectsState, ...adminTasksState]
      .filter(item => item.deadline && isDeadlineNear(item.deadline))
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    const upcomingDeadline = upcomingDeadlines.length > 0 ? upcomingDeadlines[0] : null;
    
    return {
      priority: priorityProject ? {
        name: priorityProject.name,
        progress: priorityProject.progress,
        daysStalled: 5 // This would normally be calculated from activity history
      } : null,
      upcoming: upcomingDeadline ? {
        name: upcomingDeadline.name || upcomingDeadline.description,
        deadline: upcomingDeadline.deadline
      } : null
    };
  }, [projectsState, adminTasksState]);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: colors.background }}>
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toggleDarkMode={toggleDarkMode}
        toggleAssistant={toggleAssistant}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        colors={colors}
      />
      
      <main className="flex-grow overflow-auto p-6">
        {activeTab === "journal" && (
          <JournalPage
            currentJournalDate={currentJournalDate}
            journalEntriesState={journalEntriesState}
            setJournalEntriesState={setJournalEntriesState}
            journalAnalysisState={journalAnalysisState}
            setJournalAnalysisState={setJournalAnalysisState}
            navigateJournalDate={navigateJournalDate}
            colors={colors}
          />
        )}
        
        {activeTab === "focus" && (
          <FocusPage
            currentFocusTaskId={currentFocusTaskId}
            setCurrentFocusTaskId={setCurrentFocusTaskId}
            priorityTasksState={priorityTasksState}
            timerActive={timerActive}
            setTimerActive={setTimerActive}
            timeRemaining={timeRemaining}
            setTimeRemaining={setTimeRemaining}
            timerMode={timerMode}
            setTimerMode={setTimerMode}
            colors={colors}
            projectsState={projectsState}
            handleTaskUpdate={handleTaskUpdate}
            handleTaskCreate={handleTaskCreate}
            updateProjectProgress={updateProjectProgress}
            setActiveTab={setActiveTab}
            setSelectedProjectId={setSelectedProjectId}
            setShowProjectDetailModal={setShowProjectDetailModal}
          />
        )}
        
        {activeTab === "projects" && (
          <ProjectsPage
            projectsState={projectsState}
            setProjectsState={setProjectsState}
            priorityTasksState={priorityTasksState}
            setPriorityTasksState={setPriorityTasksState}
            selectedProjectId={selectedProjectId}
            setSelectedProjectId={setSelectedProjectId}
            handleTaskCreate={handleTaskCreate}
            handleTaskUpdate={handleTaskUpdate}
            handleTaskDelete={handleTaskDelete}
            updateProjectProgress={updateProjectProgress}
            colors={colors}
            setActiveTab={setActiveTab}
            setCurrentFocusTaskId={setCurrentFocusTaskId}
          />
        )}

        {activeTab === "admin" && (
          <AdminPage
            adminTasksState={adminTasksState}
            setAdminTasksState={setAdminTasksState}
            showCompletedTasks={showCompletedTasks}
            setShowCompletedTasks={setShowCompletedTasks}
            colors={colors}
          />
        )}

        {activeTab === "reflection" && (
          <ReflectionPage
            reflectionPrompts={reflectionPrompts}
            currentPromptIndex={currentPromptIndex}
            setCurrentPromptIndex={setCurrentPromptIndex}
            reflectionContent={reflectionContent}
            setReflectionContent={setReflectionContent}
            reflectionSaved={reflectionSaved}
            setReflectionSaved={setReflectionSaved}
            colors={colors}
          />
        )}
      </main>
      
      {showAssistant && (
        <Assistant
          toggleAssistant={toggleAssistant}
          colors={colors}
          messages={assistantMessages}
          onNewMessage={handleNewMessage}
          onOptionSelect={handleOptionSelect}
          systemOverview={getSystemOverview()}
        />
      )}
    </div>
  );
};
export default MindflowApp;

import { useState, useEffect } from 'react';
import { standardizeDate, isDeadlineNear } from '../../utils/dateUtils';
import Timer from '../../components/Timer';
import { CheckCircle, Play, ArrowRight, Clock, Calendar, X, ChevronDown } from 'lucide-react';
import { CustomIcon } from '../../components/CustomIcon';

// Helper function to get color based on priority
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

const FocusPage = ({
  currentFocusTaskId,
  setCurrentFocusTaskId,
  priorityTasksState,
  timerActive,
  setTimerActive,
  timeRemaining,
  setTimeRemaining,
  timerMode,
  setTimerMode,
  colors,
  projectsState,
  handleTaskUpdate,
  handleTaskCreate,
  updateProjectProgress,
  setActiveTab,
  setSelectedProjectId,
  setShowProjectDetailModal
}) => {
  const [timerInterval, setTimerInterval] = useState(null);
  const [taskSelectorOpen, setTaskSelectorOpen] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState('all'); // 'all', 'project', 'priority'
  
  // Add state for new task modal
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState(null);
  
  // Get current task and project
  const currentTask = priorityTasksState.find(task => task.id === currentFocusTaskId);
  const currentProject = currentTask?.projectId 
    ? projectsState?.find(p => p.id === currentTask.projectId)
    : null;

  // Add new state for selected filter project
  const [selectedFilterProjectId, setSelectedFilterProjectId] = useState(null);

  // Add this state at the top of your component
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Add this state at the top of your component
  const [completedSessions, setCompletedSessions] = useState(0);

  // Add this state at the top of your component
  const [autoStartBreaks, setAutoStartBreaks] = useState(false);

  // Add this new state variable to track the selected preset
  const [selectedPreset, setSelectedPreset] = useState(20); // Default to 20 minutes instead of 25

  // Effect to set a default task if none is selected
  useEffect(() => {
    if (!currentFocusTaskId && priorityTasksState.length > 0) {
      setCurrentFocusTaskId(priorityTasksState[0].id);
    }
  }, [currentFocusTaskId, priorityTasksState]);
  
  // Effect to update filtered tasks when tasks change or filter changes
  useEffect(() => {
    let tasks = [...priorityTasksState];
    
    // Apply filters
    if (taskFilter === 'project') {
      // Use the explicitly selected project ID if available
      const projectIdToFilter = selectedFilterProjectId || (currentProject ? currentProject.id : null);
      
      if (projectIdToFilter) {
        tasks = tasks.filter(task => task.projectId === projectIdToFilter);
      }
    } else if (taskFilter === 'priority' && currentTask) {
      tasks = tasks.filter(task => task.priority === currentTask.priority);
    }
    
    // Sort tasks: incomplete first, then by priority, then by deadline
    tasks.sort((a, b) => {
      // Incomplete tasks first
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by priority
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      
      // Then by deadline
      if (a.deadline && b.deadline) {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      
      // Tasks with deadlines come before tasks without deadlines
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      
      return 0;
    });
    
    setFilteredTasks(tasks);
  }, [priorityTasksState, taskFilter, currentProject, currentTask, selectedFilterProjectId]);

  const calculateProgress = () => {
    if (!currentTask?.steps?.length) return 0;
    const completedSteps = currentTask.steps.filter(step => step.completed).length;
    return Math.round((completedSteps / currentTask.steps.length) * 100);
  };

  const toggleStep = (stepId) => {
    if (!currentTask) return;

    const updatedSteps = currentTask.steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );

    const updatedTask = {
      ...currentTask,
      steps: updatedSteps
    };
    
    // Use the handler function to update the task
    handleTaskUpdate(updatedTask);
  };

  const startTimer = () => {
    // Don't reset the time - use the current timeRemaining value
    setTimerActive(true);
    
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Start a new timer
    const intervalId = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setTimerInterval(null);
          setTimerActive(false);
          
          // Increment completed sessions if this was a focus session
          if (timerMode === 'focus') {
            setCompletedSessions(prev => prev + 1);
            
            // Auto-start break if enabled
            if (autoStartBreaks) {
              // After 4 sessions, take a long break, otherwise take a short break
              const nextMode = completedSessions % 4 === 0 ? 'long' : 'short';
              setTimerMode(nextMode);
              setTimeRemaining(nextMode === 'short' ? 5 * 60 : 15 * 60);
              
              // Start the timer after a short delay
              setTimeout(() => {
                setTimerActive(true);
                const breakIntervalId = setInterval(() => {
                  setTimeRemaining(prev => {
                    if (prev <= 1) {
                      clearInterval(breakIntervalId);
                      setTimerInterval(null);
                      setTimerActive(false);
                      return 0;
                    }
                    return prev - 1;
                  });
                }, 1000);
                setTimerInterval(breakIntervalId);
              }, 1000);
            }
          }
          
          // Play a sound when timer ends
          try {
            const audio = new Audio('https://cdn.freesound.org/previews/352/352661_5121236-lq.mp3');
            audio.play();
            
            // Browser notification
            if (Notification.permission === "granted") {
              new Notification("Timer Complete!", {
                body: timerMode === 'focus' ? "Time to take a break!" : "Break time is over. Ready to focus again?",
                icon: "/favicon.ico"
              });
            } else if (Notification.permission !== "denied") {
              Notification.requestPermission();
            }
          } catch (e) {
            console.error('Could not play sound or show notification:', e);
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setTimerInterval(intervalId);
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  // Add this helper function to calculate project progress based on tasks
  const calculateProjectProgress = (projectId) => {
    if (!projectId) return 0;
    
    const projectTasks = priorityTasksState.filter(task => task.projectId === projectId);
    
    // If there are no tasks, progress is 0%
    if (projectTasks.length === 0) return 0;
    
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
    if (totalSteps > 0) {
      const stepProgressPercentage = (stepProgress / totalSteps) * 
        ((projectTasks.length - completedTasks) / projectTasks.length) * 100;
      return Math.round(taskProgressPercentage + stepProgressPercentage);
    }
    
    return Math.round(taskProgressPercentage);
  };

  // Add this effect to update project progress when tasks change
  useEffect(() => {
    if (currentProject && currentProject.id) {
      // Calculate the current progress
      const progress = calculateProjectProgress(currentProject.id);
      
      // Only update if progress has changed
      if (progress !== currentProject.progress) {
        // Find the project in projectsState
        const updatedProject = {
          ...currentProject,
          progress
        };
        
        // Update the project (this would need to be handled by a parent component)
        // We can call a function passed as a prop to update the project
        if (typeof updateProjectProgress === 'function') {
          updateProjectProgress(currentProject.id, progress);
        }
      }
    }
  }, [currentProject, priorityTasksState]);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Focus Session</h2>
        <button
          className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
          style={{ background: colors.buttonBg, color: colors.buttonText }}
          onClick={() => {
            if (currentProject) {
              setNewTask(prev => ({
                ...prev,
                projectId: currentProject.id
              }));
            }
            setShowNewTaskModal(true);
          }}
        >
          <CustomIcon type="add" />
          <span>New Task</span>
        </button>
      </div>
      
      {/* Main content area with flex column layout */}
      <div className="flex-grow flex flex-col gap-4 overflow-hidden">
        {/* Timer Box - Now first in the stack */}
        <div 
          className="rounded-2xl shadow-md overflow-hidden flex-shrink-0"
        style={{ background: colors.cardBg }}
      >
        {/* Timer header with mode indicator */}
        <div 
          className="p-3 border-b flex items-center"
          style={{ 
            borderColor: colors.cardHighlight,
            background: timerMode === 'focus' 
              ? 'rgba(234, 88, 12, 0.1)' 
              : 'rgba(100, 149, 237, 0.1)'
          }}
        >
          <div className="flex-1 flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2"
              style={{ 
                background: timerMode === 'focus' 
                  ? '#EA580C' 
                  : '#6495ED'
              }}
            />
            <h3 className="font-semibold text-sm">
              {timerMode === 'focus' 
                ? 'Focus Timer' 
                : timerMode === 'short' 
                  ? 'Short Break (5 min)' 
                  : 'Long Break (15 min)'}
            </h3>
          </div>
          
          {completedSessions > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: colors.primary, color: 'white' }}>
              {completedSessions} {completedSessions === 1 ? 'session' : 'sessions'} completed
            </span>
          )}
        </div>
        
        <div className="p-4 flex flex-col md:flex-row gap-4">
          {/* Left side: Timer Display */}
          <div className="md:w-1/3">
            {/* Timer Display with Mode-specific styling */}
            <div 
              className="flex flex-col items-center justify-center p-4 rounded-xl h-full"
              style={{ 
                background: timerMode === 'focus' 
                  ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 50%, #B45309 100%)' 
                  : 'linear-gradient(135deg, #6495ED 0%, #5F8DE8 50%, #4F7FE5 100%)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Mode indicator */}
              <div className="text-white text-sm font-medium mb-2">
                {timerMode === 'focus' 
                  ? '🎯 FOCUS TIME' 
                  : timerMode === 'short' 
                    ? '☕ SHORT BREAK' 
                    : '🌿 LONG BREAK'}
              </div>
              
              <div className="text-4xl font-bold text-white mb-3">
                {Math.floor(timeRemaining / 60).toString().padStart(2, '0')}:{(timeRemaining % 60).toString().padStart(2, '0')}
              </div>
              
              <div className="flex gap-2 mb-3 w-full justify-center">
                <button
                  className="px-4 py-1.5 rounded-lg text-sm flex items-center gap-1 bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                  style={{ color: 'white' }}
                  onClick={() => {
                    if (timerActive) {
                      // Stop timer
                      if (timerInterval) {
                        clearInterval(timerInterval);
                        setTimerInterval(null);
                      }
                      setTimerActive(false);
                    } else {
                      // Start timer with current time setting
                      startTimer();
                    }
                  }}
                >
                  {timerActive ? (
                    <>
                      <X size={16} />
                      <span>Stop</span>
                    </>
                  ) : (
                    <>
                      <Play size={16} />
                      <span>Start</span>
                    </>
                  )}
                </button>
                
                <button
                  className="px-4 py-1.5 rounded-lg text-sm bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                  style={{ color: 'white' }}
                  onClick={() => {
                    // Reset timer based on current mode
                    if (timerMode === 'focus') {
                      setTimeRemaining(selectedPreset * 60);
                    } else if (timerMode === 'short') {
                      setTimeRemaining(5 * 60);
                    } else {
                      setTimeRemaining(15 * 60);
                    }
                    
                    // Stop timer if active
                    if (timerActive) {
                      if (timerInterval) {
                        clearInterval(timerInterval);
                        setTimerInterval(null);
                      }
                      setTimerActive(false);
                    }
                  }}
                >
                  Reset
                </button>
              </div>
              
              {timerActive && (
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-white bg-opacity-20">
                    <div 
                      className="h-full rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(timeRemaining / (timerMode === 'focus' ? selectedPreset * 60 : timerMode === 'short' ? 5 * 60 : 15 * 60)) * 100}%`,
                        background: 'white'
                      }}
                    />
                  </div>
                )}
                
                {/* Mode switching buttons */}
                <div className="flex items-center gap-1 mt-3 w-full">
                  {timerMode !== 'focus' ? (
                    <button
                      className="flex-1 px-2 py-1 rounded text-xs text-center bg-white bg-opacity-20 hover:bg-opacity-30"
                      style={{ color: 'white' }}
                      onClick={() => {
                        setTimerMode('focus');
                        setTimeRemaining(selectedPreset * 60);
                      }}
                    >
                      Return to Focus
                    </button>
                  ) : (
                    <>
                      <button
                        className="flex-1 px-2 py-1 rounded text-xs text-center bg-white bg-opacity-10 hover:bg-opacity-20"
                        style={{ color: 'white' }}
                        onClick={() => {
                          setTimerMode('short');
                          setTimeRemaining(5 * 60);
                        }}
                      >
                        Short Break
                      </button>
                      <button
                        className="flex-1 px-2 py-1 rounded text-xs text-center bg-white bg-opacity-10 hover:bg-opacity-20"
                        style={{ color: 'white' }}
                        onClick={() => {
                          setTimerMode('long');
                          setTimeRemaining(15 * 60);
                        }}
                      >
                        Long Break
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right side: Timer Controls */}
            <div className="md:w-2/3">
              {/* Duration Presets - Only shown in Focus mode */}
              {timerMode === 'focus' && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Focus Duration</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      className="p-2 rounded-lg text-xs text-center"
                      style={{ 
                        background: selectedPreset === 20 ? colors.primary : colors.cardHighlight,
                        color: selectedPreset === 20 ? 'white' : colors.text
                      }}
                      onClick={() => {
                        setTimeRemaining(20 * 60);
                        setSelectedPreset(20);
                      }}
                    >
                      20 min
                    </button>
                    <button
                      className="p-2 rounded-lg text-xs text-center"
                      style={{ 
                        background: selectedPreset === 45 ? colors.primary : colors.cardHighlight,
                        color: selectedPreset === 45 ? 'white' : colors.text
                      }}
                      onClick={() => {
                        setTimeRemaining(45 * 60);
                        setSelectedPreset(45);
                      }}
                    >
                      45 min
                    </button>
                    <button
                      className="p-2 rounded-lg text-xs text-center"
                      style={{ 
                        background: selectedPreset === 60 ? colors.primary : colors.cardHighlight,
                        color: selectedPreset === 60 ? 'white' : colors.text
                      }}
                      onClick={() => {
                        setTimeRemaining(60 * 60);
                        setSelectedPreset(60);
                      }}
                    >
                      60 min
                    </button>
                    <button
                      className="p-2 rounded-lg text-xs text-center"
                      style={{ 
                        background: selectedPreset === 90 ? colors.primary : colors.cardHighlight,
                        color: selectedPreset === 90 ? 'white' : colors.text
                      }}
                      onClick={() => {
                        setTimeRemaining(90 * 60);
                        setSelectedPreset(90);
                      }}
                    >
                      90 min
                    </button>
                  </div>
                </div>
              )}
              
              {/* Custom Timer Input - Only shown in Focus mode */}
              {timerMode === 'focus' && (
                <div className="w-full mb-4">
                  <h4 className="text-sm font-medium mb-2">Custom Timer</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow">
                      <input
                        type="number"
                        min="1"
                        max="180"
                        className="w-full p-2 rounded-lg text-sm"
                        style={{ background: colors.cardHighlight }}
                        placeholder="Enter minutes"
                        onChange={(e) => {
                          const minutes = parseInt(e.target.value);
                          if (!isNaN(minutes) && minutes > 0) {
                            // Don't auto-set the time, just store the value
                            e.target.dataset.minutes = minutes;
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const minutes = parseInt(e.target.dataset.minutes);
                            if (!isNaN(minutes) && minutes > 0) {
                              setTimerMode('focus');
                              setTimeRemaining(minutes * 60);
                              setSelectedPreset(minutes); // Set the custom time as the selected preset
                              e.target.value = ''; // Clear the input
                            }
                          }
                        }}
                      />
                    </div>
                    <button
                      className="px-3 py-2 rounded-lg text-xs"
                      style={{ background: colors.primary, color: 'white' }}
                      onClick={(e) => {
                        const input = e.target.parentNode.querySelector('input');
                        const minutes = parseInt(input.dataset.minutes);
                        if (!isNaN(minutes) && minutes > 0) {
                          setTimerMode('focus');
                          setTimeRemaining(minutes * 60);
                          setSelectedPreset(minutes); // Set the custom time as the selected preset
                          input.value = ''; // Clear the input
                        }
                      }}
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
              
              {/* Break mode explanation - Only shown in break modes */}
              {timerMode !== 'focus' && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Break Time</h4>
                  <div className="p-3 rounded-lg text-sm" style={{ background: colors.cardHighlight }}>
                    <p>
                      {timerMode === 'short' 
                        ? "Take a short 5-minute break. Stand up, stretch, or grab a glass of water." 
                        : "Enjoy your 15-minute break. Step away from your screen and recharge."}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Additional timer settings */}
              <div className="mt-4">
                <div className="flex items-center">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={autoStartBreaks}
                      onChange={() => setAutoStartBreaks(!autoStartBreaks)}
                      className="rounded"
                    />
                    Auto-start breaks after focus sessions
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Panel - Now second in the stack with scrolling */}
        <div 
          className="rounded-2xl shadow-md overflow-hidden flex flex-col flex-grow"
          style={{ background: colors.cardBg }}
        >
          <div 
            className="p-4 border-b flex-shrink-0"
            style={{ borderColor: colors.cardHighlight }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Current Task</h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    className="px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                    style={{ background: colors.buttonBg, color: colors.buttonText }}
                    onClick={() => setTaskSelectorOpen(!taskSelectorOpen)}
                  >
                    <span>Select Focus Task</span>
                    <ArrowRight size={14} className={`transition-transform ${taskSelectorOpen ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {taskSelectorOpen && (
                    <div 
                      className="absolute right-0 mt-1 w-72 rounded-lg shadow-lg z-10 overflow-hidden"
                      style={{ background: colors.cardBg }}
                    >
                      <div className="p-2 border-b" style={{ borderColor: colors.cardHighlight }}>
                        {/* Project filter dropdown */}
                        <div className="mb-2">
                          <label className="block text-xs font-medium mb-1">Filter by Project</label>
                          <select
                            className="w-full p-1 rounded text-xs"
                            style={{ background: colors.cardHighlight }}
                            onChange={(e) => {
                              const projectId = e.target.value ? parseInt(e.target.value) : null;
                              if (projectId) {
                                // Store the selected project ID in state for consistent filtering
                                setSelectedFilterProjectId(projectId);
                                setTaskFilter('project');
                              } else {
                                setSelectedFilterProjectId(null);
                                setTaskFilter('all');
                              }
                            }}
                            value={selectedFilterProjectId || ''}
                          >
                            <option value="">All Projects</option>
                            {projectsState.map(project => (
                              <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Search input */}
                        <div className="mb-2">
                          <input
                            type="text"
                            placeholder="Search tasks..."
                            className="w-full p-1 rounded text-xs"
                            style={{ background: colors.cardHighlight }}
                            onChange={(e) => {
                              const searchTerm = e.target.value.toLowerCase();
                              if (searchTerm) {
                                let searchResults = priorityTasksState.filter(task => 
                                  task.name.toLowerCase().includes(searchTerm)
                                );
                                
                                // Maintain project filter if active
                                if (taskFilter === 'project' && selectedFilterProjectId) {
                                  searchResults = searchResults.filter(task => task.projectId === selectedFilterProjectId);
                                } else if (taskFilter === 'priority' && currentTask) {
                                  searchResults = searchResults.filter(task => task.priority === currentTask.priority);
                                }
                                
                                setFilteredTasks(searchResults);
                              } else {
                                // Reset to current filter without changing the filter type
                                if (taskFilter === 'project' && selectedFilterProjectId) {
                                  const projectTasks = priorityTasksState.filter(task => task.projectId === selectedFilterProjectId);
                                  setFilteredTasks(projectTasks);
                                } else if (taskFilter === 'priority' && currentTask) {
                                  const priorityTasks = priorityTasksState.filter(task => task.priority === currentTask.priority);
                                  setFilteredTasks(priorityTasks);
                                } else {
                                  setFilteredTasks(priorityTasksState);
                                }
                              }
                            }}
                          />
                        </div>
                        
                        {/* Filter buttons */}
                        <div className="flex gap-1">
                          <button
                            className={`flex-1 px-2 py-1 rounded text-xs ${taskFilter === 'all' ? 'font-medium' : 'opacity-70'}`}
                            style={{ 
                              background: taskFilter === 'all' ? colors.cardHighlight : 'transparent',
                            }}
                            onClick={() => setTaskFilter('all')}
                          >
                            All Tasks
                          </button>
                          <button
                            className={`flex-1 px-2 py-1 rounded text-xs ${taskFilter === 'project' ? 'font-medium' : 'opacity-70'}`}
                            style={{ 
                              background: taskFilter === 'project' ? colors.cardHighlight : 'transparent',
                            }}
                            onClick={() => {
                              // Only set to project filter if a project is selected
                              if (selectedFilterProjectId) {
                                setTaskFilter('project');
                              } else if (currentProject) {
                                // If no project is selected in dropdown but we have a current task with a project
                                setSelectedFilterProjectId(currentProject.id);
                                setTaskFilter('project');
                              }
                            }}
                            disabled={!selectedFilterProjectId && !currentProject}
                          >
                            Same Project
                          </button>
                          <button
                            className={`flex-1 px-2 py-1 rounded text-xs ${taskFilter === 'priority' ? 'font-medium' : 'opacity-70'}`}
                            style={{ 
                              background: taskFilter === 'priority' ? colors.cardHighlight : 'transparent',
                            }}
                            onClick={() => {
                              if (currentTask) {
                                setTaskFilter('priority');
                              }
                            }}
                            disabled={!currentTask}
                          >
                            Same Priority
                          </button>
                        </div>
                      </div>
                      
                      <div className="max-h-60 overflow-y-auto">
                        {filteredTasks.length > 0 ? (
                          filteredTasks.map(task => (
                            <button
                              key={task.id}
                              className="w-full text-left p-2 hover:opacity-80 transition-opacity flex items-center gap-2 border-b"
                              style={{ 
                                background: task.id === currentFocusTaskId 
                                  ? colors.cardHighlight 
                                  : (selectedFilterProjectId && task.projectId === selectedFilterProjectId)
                                    ? colors.cardHighlight + '40'  // Subtle highlight for tasks in selected project
                                    : 'transparent',
                                borderColor: colors.cardHighlight
                              }}
                              onClick={() => {
                                setCurrentFocusTaskId(task.id);
                                setTaskSelectorOpen(false);
                              }}
                            >
                              <div 
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ 
                                  background: getPriorityColor(task.priority)
                                }}
                              />
                              <div className="flex-grow">
                                <div className={`text-sm ${task.completed ? 'line-through opacity-50' : ''}`}>
                                  {task.name}
                                </div>
                                {task.projectId && (
                                  <div className="text-xs opacity-70">
                                    {projectsState.find(p => p.id === task.projectId)?.name || 'Unknown Project'}
                                  </div>
                                )}
                              </div>
                              {task.deadline && (
                                <div className="text-xs opacity-70 whitespace-nowrap">
                                  {new Date(task.deadline).toLocaleDateString()}
                                </div>
                              )}
                            </button>
                          ))
                        ) : (
                          <div className="p-4 text-center opacity-70 text-sm">
                            {taskFilter === 'project' && selectedFilterProjectId 
                              ? "No tasks in this project" 
                              : "No tasks available"}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Make the task content area scrollable */}
          <div className="flex-grow overflow-y-auto">
            {currentTask ? (
              <div className="p-4">
                {/* Task details section */}
                <div className="mb-4">
                  <h4 className="font-bold text-lg flex items-center">
                    <span 
                      className="inline-block w-3 h-3 rounded-full mr-2"
                      style={{ background: currentProject ? currentProject.color : getPriorityColor(currentTask.priority) }}
                    />
                    {currentTask.name}
                    {currentTask.completed && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800">
                        Completed
                      </span>
                    )}
                  </h4>
                  
                  <div className="mt-2 flex flex-wrap gap-2">
                    {currentProject && (
                      <div className="text-sm flex items-center">
                        <span style={{ color: colors.primary }}>Project:</span> 
                        <span 
                          className="ml-1 px-2 py-0.5 rounded-full text-xs"
                          style={{ background: currentProject.color + '40', color: colors.text }}
                        >
                          {currentProject.name}
                        </span>
                        <span className="ml-1">({currentProject.progress}% complete)</span>
                      </div>
                    )}
                    
                    {currentTask.deadline && (
                      <div className="text-sm flex items-center">
                        <Calendar size={14} className="mr-1" style={{ color: colors.primary }} />
                        <span>{standardizeDate(currentTask.deadline)}</span>
                        {isDeadlineNear(currentTask.deadline) && (
                          <span className="ml-2 px-1 py-0.5 text-xs rounded" style={{ background: colors.dangerBg, color: colors.dangerText }}>
                            Soon
                          </span>
                        )}
                      </div>
                    )}
                    
                    {currentTask.priority && (
                      <div className="text-sm flex items-center">
                        <Clock size={14} className="mr-1" style={{ color: colors.primary }} />
                        <span 
                          className="px-2 py-0.5 rounded-full text-xs"
                          style={{ 
                            background: getPriorityColor(currentTask.priority) + '40',
                            color: getPriorityColor(currentTask.priority)
                          }}
                        >
                          {currentTask.priority.charAt(0).toUpperCase() + currentTask.priority.slice(1)} Priority
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Notes section */}
                  {currentTask.notes && (
                    <div className="mt-3 p-3 rounded-lg text-sm" style={{ background: colors.cardHighlight }}>
                      <div className="opacity-70 mb-1 font-medium">Notes:</div>
                      <div>{currentTask.notes}</div>
                    </div>
                  )}
                </div>
                
                {/* Task steps */}
                {currentTask.steps && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium">Steps:</h5>
                      <span className="text-xs opacity-70">
                        {currentTask.steps.filter(step => step.completed).length}/{currentTask.steps.length} completed
                      </span>
                    </div>
                    <div className="space-y-2">
                      <ul className="space-y-2">
                        {currentTask.steps.map(step => (
                          <li 
                            key={step.id} 
                            className="flex items-start p-2 rounded-lg transition-all duration-200"
                            style={{ 
                              background: colors.cardHighlight,
                              opacity: step.completed ? 0.7 : 1
                            }}
                          >
                            <button
                              className={`mr-3 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                step.completed 
                                  ? 'bg-green-500 text-white' 
                                  : 'border border-gray-400'
                              }`}
                              onClick={() => toggleStep(step.id)}
                            >
                              {step.completed && <CheckCircle size={14} />}
                            </button>
                            <input
                              type="text"
                              value={step.description}
                              onChange={(e) => {
                                const updatedSteps = currentTask.steps.map(s =>
                                  s.id === step.id ? { ...s, description: e.target.value } : s
                                );
                                handleTaskUpdate({
                                  ...currentTask,
                                  steps: updatedSteps
                                });
                              }}
                              className="flex-grow bg-transparent outline-none"
                              style={{ 
                                textDecoration: step.completed ? 'line-through' : 'none',
                                opacity: step.completed ? 0.5 : 1
                              }}
                              placeholder="Enter step description..."
                            />
                            {currentTask.steps.length > 1 && (
                              <button
                                className="ml-2 p-1 rounded-full hover:bg-opacity-80"
                                style={{ color: colors.dangerText }}
                                onClick={() => {
                                  const updatedSteps = currentTask.steps.filter(s => s.id !== step.id);
                                  handleTaskUpdate({
                                    ...currentTask,
                                    steps: updatedSteps
                                  });
                                }}
                              >
                                <X size={14} />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                      {/* Add Step button moved to bottom */}
                      <button
                        className="w-full p-2 rounded-lg text-xs flex items-center justify-center gap-1"
                        style={{ background: colors.cardHighlight }}
                        onClick={() => {
                          const updatedTask = {
                            ...currentTask,
                            steps: [
                              ...currentTask.steps,
                              { id: Date.now(), description: '', completed: false }
                            ]
                          };
                          handleTaskUpdate(updatedTask);
                        }}
                      >
                        <CustomIcon type="add" size={14} />
                        <span>Add Step</span>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Progress tracking and Project contribution - Combined styling */}
                <div className="mt-4 space-y-3">
                  {/* Task Progress */}
                  <div className="p-3 rounded-lg" style={{ background: colors.cardHighlight }}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Task Progress</span>
                      <span className="text-sm font-medium">{calculateProgress()}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: colors.cardBg }}>
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${calculateProgress()}%`,
                          background: colors.primary
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Project contribution - Matching styling */}
                  {currentProject && (
                    <div className="p-3 rounded-lg" style={{ background: colors.cardHighlight }}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Contribution to project</span>
                        <span className="text-sm">
                          {(() => {
                            const projectTasks = priorityTasksState.filter(task => task.projectId === currentProject.id);
                            return `1/${projectTasks.length} tasks (${Math.round(100/projectTasks.length)}%)`;
                          })()}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: colors.cardBg }}>
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{ 
                            width: currentTask.completed ? '100%' : `${calculateProgress()}%`,
                            background: currentProject.color
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Action buttons */}
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 py-2 rounded-xl text-sm"
                    style={{ 
                      background: currentTask.completed ? colors.cardHighlight : colors.buttonBg,
                      color: currentTask.completed ? colors.text : colors.buttonText
                    }}
                    onClick={() => {
                      // Toggle task completion
                      const updatedTask = {
                        ...currentTask, 
                        completed: !currentTask.completed,
                        steps: !currentTask.completed 
                          ? currentTask.steps.map(step => ({ ...step, completed: true }))
                          : currentTask.steps
                      };
                      
                      handleTaskUpdate(updatedTask);
                    }}
                  >
                    {currentTask.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center opacity-70">
                <p>No tasks available.</p>
                <p className="text-sm mt-2">Add tasks in the Projects tab to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
            style={{ background: colors.cardBg, color: colors.text }}
          >
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
              <h2 className="font-bold text-lg">New Task</h2>
              <button onClick={() => {
                setShowNewTaskModal(false);
                setNewTask({
                  name: '',
                  projectId: currentProject?.id || null,
                  deadline: '',
                  priority: 'medium',
                  notes: '',
                  steps: [{ id: Date.now(), description: '', completed: false }]
                });
              }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Task Name</label>
                <input
                  type="text"
                  value={newTask.name || ''}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  value={newTask.projectId || ''}
                  onChange={(e) => setNewTask({...newTask, projectId: e.target.value ? Number(e.target.value) : null})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                >
                  <option value="" disabled>Select a project</option>
                  {projectsState.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={newTask.priority || 'medium'}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
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
                  value={newTask.deadline || ''}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newTask.notes || ''}
                  onChange={(e) => setNewTask({...newTask, notes: e.target.value})}
                  className="w-full p-2 rounded-lg resize-none h-20"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Steps</label>
                  <button
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: colors.primary, color: colors.buttonText }}
                    onClick={() => {
                      setNewTask({
                        ...newTask,
                        steps: [...(newTask.steps || []), { id: Date.now(), description: '', completed: false }]
                      });
                    }}
                  >
                    Add Step
                  </button>
                </div>
                
                <div className="space-y-2">
                  {newTask.steps && newTask.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
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
                        placeholder="Step description"
                      />
                      
                      {newTask.steps.length > 1 && (
                        <button
                          className="p-1 rounded-full"
                          style={{ color: colors.dangerText }}
                          onClick={() => {
                            const updatedSteps = newTask.steps.filter((_, i) => i !== index);
                            setNewTask({...newTask, steps: updatedSteps});
                          }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
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
                  opacity: !newTask.name || !newTask.projectId ? 0.5 : 1 
                }}
                disabled={!newTask.name || !newTask.projectId}
                onClick={() => {
                  if (newTask.name && newTask.projectId) {
                    // Create the new task
                    const taskToAdd = {
                      ...newTask,
                      id: Date.now(),
                      steps: newTask.steps.filter(step => step.description.trim() !== '')
                    };
                    
                    // If no steps have descriptions, add a default step
                    if (taskToAdd.steps.length === 0) {
                      taskToAdd.steps = [{ id: Date.now(), description: 'Complete task', completed: false }];
                    }
                    
                    // Use the handleTaskCreate function to add the task
                    const newTaskId = handleTaskCreate(taskToAdd);
                    
                    // Show success message
                    setSuccessMessage(`Task "${taskToAdd.name}" created successfully!`);
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000);
                    
                    // Optionally set the new task as the current focus task
                    if (newTaskId) {
                      setCurrentFocusTaskId(newTaskId);
                    }
                    
                    // Reset form and close modal
                    setShowNewTaskModal(false);
                    setNewTask({
                      name: '',
                      projectId: null,
                      deadline: '',
                      priority: 'medium',
                      notes: '',
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

      {showSuccessMessage && (
        <div 
          className="fixed bottom-4 right-4 p-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in"
          style={{ background: colors.primary, color: 'white' }}
        >
          <CheckCircle size={16} />
          <span>{successMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FocusPage; 
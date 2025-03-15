import React, { useState, useEffect } from 'react';
import { standardizeDate, isDeadlineNear } from '../../utils/dateUtils';
import { Edit3, MoreHorizontal, X, Trash2, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';
import { CustomIcon } from '../../components/CustomIcon';

const ProjectsPage = ({
  projectsState,
  setProjectsState,
  priorityTasksState,
  setPriorityTasksState,
  selectedProjectId,
  setSelectedProjectId,
  handleTaskCreate,
  handleTaskUpdate,
  handleTaskDelete,
  updateProjectProgress,
  colors,
  setActiveTab,
  setCurrentFocusTaskId
}) => {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showProjectDetailModal, setShowProjectDetailModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [editProjectProgress, setEditProjectProgress] = useState(0);
  const [expandedProjects, setExpandedProjects] = useState({});
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [newProject, setNewProject] = useState({
    name: '',
    priority: 'medium',
    deadline: '',
    color: '#D4A373',
    tasks: []
  });
  const [editingProject, setEditingProject] = useState(null);
  const [newTask, setNewTask] = useState({
    name: '',
    projectId: null,
    deadline: '',
    priority: 'medium',
    notes: '',
    steps: []
  });

  // Toggle project expansion
  const toggleProjectExpansion = (projectId) => {
    setExpandedProjects(prev => ({
      ...prev,
      [projectId]: !prev[projectId]
    }));
  };
  
  // Get tasks for a specific project
  const getProjectTasks = (projectId) => {
    return priorityTasksState.filter(task => task.projectId === projectId);
  };
  
  // Calculate project progress based on completed tasks
  const calculateProjectProgress = (projectId) => {
    // Use the handler function to update project progress
    updateProjectProgress(projectId);
    
    // Return the current progress from the project state
    const project = projectsState.find(p => p.id === projectId);
    return project ? project.progress : 0;
  };
  
  // Update project when editing
  useEffect(() => {
    if (selectedProjectId) {
      const project = projectsState.find(p => p.id === selectedProjectId);
      if (project) {
        setEditingProject({...project});
        setEditProjectProgress(project.progress);
      }
    }
  }, [selectedProjectId, projectsState]);
  
  // Update task when editing
  useEffect(() => {
    if (selectedTaskId) {
      const task = priorityTasksState.find(t => t.id === selectedTaskId);
      if (task) {
        setEditingTask({...task});
      }
    }
  }, [selectedTaskId, priorityTasksState]);
  
  // Handle project deletion
  const handleDeleteProject = (projectId) => {
    // Remove the project
    const updatedProjects = projectsState.filter(project => project.id !== projectId);
    setProjectsState(updatedProjects);
    
    // Remove associated tasks
    const updatedTasks = priorityTasksState.filter(task => task.projectId !== projectId);
    setPriorityTasksState(updatedTasks);
    
    // Clean up expandedProjects state
    setExpandedProjects(prev => {
      const updated = {...prev};
      delete updated[projectId];
      return updated;
    });
    
    // Close the modal
    setShowProjectDetailModal(false);
    setSelectedProjectId(null);
  };
  
  // Handle project update
  const handleUpdateProject = () => {
    if (editingProject && editingProject.name) {
      // Create a copy of the project with updated progress
      const updatedProject = {
        ...editingProject,
        progress: editProjectProgress
      };
      
      // Update the projects state
      const updatedProjects = projectsState.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      );
      
      // Sort by priority
      const sortedProjects = updatedProjects.sort((a, b) => {
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
      
      // Update the state
      setProjectsState(sortedProjects);
      
      // Update progress for any tasks associated with this project
      // This should happen after the project state is updated
      setTimeout(() => {
        updateProjectProgress(updatedProject.id);
      }, 0);
      
      // Close the modal and reset selection
      setShowProjectDetailModal(false);
      setSelectedProjectId(null);
    }
  };
  
  // Handle task deletion
  const handleDeleteTask = (taskId) => {
    // Use the handler function to delete the task
    handleTaskDelete(taskId);
    
    // Close the modal
    setShowTaskDetailModal(false);
    setSelectedTaskId(null);
  };
  
  // Handle task update
  const handleUpdateTask = () => {
    if (editingTask && editingTask.name) {
      // Use the handler function to update the task
      handleTaskUpdate(editingTask);
      
      // Close the modal
      setShowTaskDetailModal(false);
      setSelectedTaskId(null);
    }
  };
  
  // Toggle step completion
  const toggleStepCompletion = (taskId, stepId) => {
    const task = priorityTasksState.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedSteps = task.steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    
    const updatedTask = { ...task, steps: updatedSteps };
    
    // Use the handler function to update the task
    handleTaskUpdate(updatedTask);
  };

  // Add a function to start focusing on a task
  const startFocusOnTask = (taskId) => {
    if (typeof setCurrentFocusTaskId !== 'function' || typeof setActiveTab !== 'function') {
      console.error('Required functions setCurrentFocusTaskId or setActiveTab are not available');
      return;
    }
    setCurrentFocusTaskId(taskId);
    setActiveTab("focus");
  };

  return (
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
            className="p-4 rounded-xl transition-all duration-200 hover:shadow-md"
            style={{ 
              background: colors.cardHighlight,
              borderLeft: `4px solid ${project.color}`
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <button 
                  className="mr-2 transition-transform duration-200"
                  style={{ transform: expandedProjects[project.id] ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  onClick={() => toggleProjectExpansion(project.id)}
                >
                  <ChevronRight size={16} />
                </button>
                <h3 className="font-semibold">{project.name}</h3>
              </div>
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
                  className="p-1 rounded-full hover:bg-opacity-10 hover:bg-black transition-colors"
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
                className="h-2 rounded-full overflow-hidden"
                style={{ 
                  background: project.color + '40', 
                  width: '100%' 
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-300"
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
                {isDeadlineNear(project.deadline) && (
                  <span className="ml-2 text-xs px-1 py-0.5 rounded" style={{ background: colors.dangerBg, color: colors.dangerText }}>
                    Soon
                  </span>
                )}
              </div>
              <button
                className="px-2 py-1 rounded-lg text-xs hover:opacity-80 transition-opacity"
                style={{ background: colors.primary, color: colors.buttonText }}
                onClick={() => {
                  // Add a task for this project
                  setSelectedProjectId(project.id);
                  setNewTask({...newTask, projectId: project.id});
                  setShowNewTaskModal(true);
                }}
              >
                Add Task
              </button>
            </div>
            
            {/* Display associated tasks */}
            {expandedProjects[project.id] && (
              <div 
                className="mt-3 pt-3 border-t transition-all duration-300" 
                style={{ borderColor: colors.cardBg }}
              >
                <div className="space-y-2">
                  {getProjectTasks(project.id).length > 0 ? (
                    getProjectTasks(project.id).map(task => (
                      <div 
                        key={task.id}
                        className="flex justify-between items-center p-2 rounded-lg text-sm cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ 
                          background: colors.cardBg,
                          borderLeft: `3px solid ${
                            task.priority === 'high' ? '#EF4444' : 
                            task.priority === 'medium' ? '#F59E0B' : '#10B981'
                          }`
                        }}
                      >
                        <div className="flex items-center">
                          <div className="flex flex-col">
                            <div className="font-medium">{task.name}</div>
                            {task.steps.length > 0 && (
                              <div className="text-xs opacity-70 mt-1">
                                {task.steps.filter(step => step.completed).length}/{task.steps.length} steps completed
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-xs opacity-70">
                            {standardizeDate(task.deadline)}
                          </div>
                          <button
                            className="p-1 rounded-full hover:bg-opacity-10 hover:bg-black"
                            style={{ color: colors.primary }}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening task details
                              startFocusOnTask(task.id);
                            }}
                            title="Focus on this task"
                          >
                            <CustomIcon type="focus" />
                          </button>
                          <ChevronRight size={14} onClick={() => {
                            setSelectedTaskId(task.id);
                            setShowTaskDetailModal(true);
                          }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3 text-sm opacity-70">
                      No tasks yet. Add your first task to this project.
                    </div>
                  )}
                </div>
              </div>
            )}
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
            
            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Project Details Section */}
              <div className="p-3 rounded-lg" style={{ background: colors.cardHighlight }}>
                <h3 className="font-medium mb-3">Project Details</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                      className="w-full p-2 rounded-lg"
                      style={{ background: colors.cardBg }}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      value={newProject.priority}
                      onChange={(e) => setNewProject({...newProject, priority: e.target.value})}
                      className="w-full p-2 rounded-lg"
                      style={{ background: colors.cardBg }}
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
                      style={{ background: colors.cardBg }}
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
              </div>
              
              {/* Tasks Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Project Tasks</h3>
                  <button
                    className="text-xs px-2 py-1 rounded-lg"
                    style={{ background: colors.primary, color: colors.buttonText }}
                    onClick={() => {
                      setNewProject({
                        ...newProject,
                        tasks: [...newProject.tasks, { 
                          id: Date.now(), 
                          name: '', 
                          deadline: '', 
                          priority: 'medium',
                          notes: '',
                          steps: [{ id: Date.now(), description: '', completed: false }]
                        }]
                      });
                    }}
                  >
                    Add Task
                  </button>
                </div>
                
                {newProject.tasks.map((task, taskIndex) => (
                  <div 
                    key={task.id} 
                    className="p-3 rounded-lg mb-3"
                    style={{ background: colors.cardHighlight }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium">Task {taskIndex + 1}</h4>
                      {newProject.tasks.length > 1 && (
                        <button
                          className="p-1 rounded-full"
                          style={{ color: colors.dangerText }}
                          onClick={() => {
                            const updatedTasks = newProject.tasks.filter((_, i) => i !== taskIndex);
                            setNewProject({...newProject, tasks: updatedTasks});
                          }}
                        >
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">Task Name</label>
                        <input
                          type="text"
                          value={task.name}
                          onChange={(e) => {
                            const updatedTasks = [...newProject.tasks];
                            updatedTasks[taskIndex].name = e.target.value;
                            setNewProject({...newProject, tasks: updatedTasks});
                          }}
                          className="w-full p-2 rounded-lg text-sm"
                          style={{ background: colors.cardBg }}
                          placeholder="Enter task name"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1">Priority</label>
                          <select
                            value={task.priority}
                            onChange={(e) => {
                              const updatedTasks = [...newProject.tasks];
                              updatedTasks[taskIndex].priority = e.target.value;
                              setNewProject({...newProject, tasks: updatedTasks});
                            }}
                            className="w-full p-2 rounded-lg text-sm"
                            style={{ background: colors.cardBg }}
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </select>
                        </div>
                        
                        <div className="flex-1">
                          <label className="block text-xs font-medium mb-1">Deadline</label>
                          <input
                            type="date"
                            value={task.deadline}
                            onChange={(e) => {
                              const updatedTasks = [...newProject.tasks];
                              updatedTasks[taskIndex].deadline = e.target.value;
                              setNewProject({...newProject, tasks: updatedTasks});
                            }}
                            className="w-full p-2 rounded-lg text-sm"
                            style={{ background: colors.cardBg }}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="block text-xs font-medium">Steps</label>
                          <button
                            className="text-xs px-1 py-0.5 rounded"
                            style={{ background: colors.primary, color: colors.buttonText }}
                            onClick={() => {
                              const updatedTasks = [...newProject.tasks];
                              updatedTasks[taskIndex].steps.push({ 
                                id: Date.now(), 
                                description: '', 
                                completed: false 
                              });
                              setNewProject({...newProject, tasks: updatedTasks});
                            }}
                          >
                            + Step
                          </button>
                        </div>
                        
                        <div className="space-y-1">
                          {task.steps.map((step, stepIndex) => (
                            <div key={step.id} className="flex items-center gap-1">
                              <input
                                type="text"
                                value={step.description}
                                onChange={(e) => {
                                  const updatedTasks = [...newProject.tasks];
                                  updatedTasks[taskIndex].steps[stepIndex].description = e.target.value;
                                  setNewProject({...newProject, tasks: updatedTasks});
                                }}
                                className="flex-grow p-1 rounded text-xs"
                                style={{ background: colors.cardBg }}
                                placeholder="Step description"
                              />
                              
                              {task.steps.length > 1 && (
                                <button
                                  className="p-1 rounded-full"
                                  style={{ color: colors.dangerText }}
                                  onClick={() => {
                                    const updatedTasks = [...newProject.tasks];
                                    updatedTasks[taskIndex].steps = updatedTasks[taskIndex].steps.filter(
                                      (_, i) => i !== stepIndex
                                    );
                                    setNewProject({...newProject, tasks: updatedTasks});
                                  }}
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t" style={{ borderColor: colors.cardHighlight }}>
              <button
                className="w-full py-2 rounded-xl"
                style={{ 
                  background: colors.buttonBg, 
                  color: colors.buttonText,
                  opacity: !newProject.name || newProject.tasks.some(task => !task.name) ? 0.5 : 1 
                }}
                disabled={!newProject.name || newProject.tasks.some(task => !task.name)}
                onClick={() => {
                  if (newProject.name && !newProject.tasks.some(task => !task.name)) {
                    const projectId = Date.now();
                    
                    // Create the project
                    const projectToAdd = {
                      id: projectId,
                      name: newProject.name,
                      priority: newProject.priority,
                      deadline: newProject.deadline,
                      color: newProject.color,
                      progress: 0,
                    };
                    
                    // Add the project and maintain sort by priority
                    const updatedProjects = [...projectsState, projectToAdd];
                    const sortedProjects = updatedProjects.sort((a, b) => {
                      const priorityOrder = { high: 1, medium: 2, low: 3 };
                      return priorityOrder[a.priority] - priorityOrder[b.priority];
                    });
                    setProjectsState(sortedProjects);
                    
                    // Create all tasks for this project
                    const tasksToAdd = newProject.tasks.map(task => ({
                      id: Date.now() + Math.random() * 1000,
                      name: task.name,
                      projectId: projectId,
                      deadline: task.deadline || newProject.deadline,
                      priority: task.priority,
                      notes: task.notes || '',
                      steps: task.steps.filter(step => step.description.trim() !== '')
                    }));
                    
                    // Add all tasks
                    const updatedTasks = [...priorityTasksState, ...tasksToAdd];
                    setPriorityTasksState(updatedTasks);
                    
                    // Auto-expand the new project
                    setExpandedProjects(prev => ({
                      ...prev,
                      [projectId]: true
                    }));
                    
                    // Reset form and close modal
                    setShowNewProjectModal(false);
                    setNewProject({
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
                  }
                }}
              >
                Create Project with Tasks
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Project Detail Modal */}
      {showProjectDetailModal && editingProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
            style={{ background: colors.cardBg, color: colors.text }}
          >
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
              <h2 className="font-bold text-lg">Edit Project</h2>
              <button onClick={() => {
                setShowProjectDetailModal(false);
                setSelectedProjectId(null);
              }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({...editingProject, name: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={editingProject.priority}
                  onChange={(e) => setEditingProject({...editingProject, priority: e.target.value})}
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
                  value={editingProject.deadline}
                  onChange={(e) => setEditingProject({...editingProject, deadline: e.target.value})}
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
                      className={`w-8 h-8 rounded-full ${editingProject.color === color ? 'ring-2 ring-offset-2' : ''}`}
                      style={{ background: color, ringColor: colors.text }}
                      onClick={() => setEditingProject({...editingProject, color: color})}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Progress ({editProjectProgress}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={editProjectProgress}
                  onChange={(e) => setEditProjectProgress(parseInt(e.target.value))}
                  className="w-full"
                  style={{ accentColor: editingProject.color }}
                />
              </div>
            </div>
            
            <div className="p-4 border-t flex justify-between" style={{ borderColor: colors.cardHighlight }}>
              <button
                className="px-4 py-2 rounded-xl"
                style={{ background: colors.dangerBg, color: colors.dangerText }}
                onClick={() => handleDeleteProject(editingProject.id)}
              >
                <Trash2 size={16} className="inline mr-1" />
                Delete
              </button>
              
              <button
                className="px-4 py-2 rounded-xl"
                style={{ 
                  background: colors.buttonBg, 
                  color: colors.buttonText,
                  opacity: !editingProject.name ? 0.5 : 1 
                }}
                disabled={!editingProject.name}
                onClick={handleUpdateProject}
              >
                <CheckCircle size={16} className="inline mr-1" />
                Save Changes
              </button>
            </div>
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
              <button onClick={() => {
                setShowNewTaskModal(false);
                setNewTask({
                  name: '',
                  projectId: null,
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
                  value={newTask.name}
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
                  value={newTask.priority}
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
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={newTask.notes}
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
                        steps: [...newTask.steps, { id: Date.now(), description: '', completed: false }]
                      });
                    }}
                  >
                    Add Step
                  </button>
                </div>
                
                <div className="space-y-2">
                  {newTask.steps.map((step, index) => (
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
                    
                    // Use the handler function to add the task
                    handleTaskCreate(taskToAdd);
                    
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
      
      {/* Task Detail Modal */}
      {showTaskDetailModal && editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className="rounded-2xl shadow-lg max-w-md w-full overflow-hidden flex flex-col"
            style={{ background: colors.cardBg, color: colors.text }}
          >
            <div className="flex justify-between items-center p-4 border-b" style={{ borderColor: colors.cardHighlight }}>
              <h2 className="font-bold text-lg">Task Details</h2>
              <button onClick={() => {
                setShowTaskDetailModal(false);
                setSelectedTaskId(null);
              }}>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Task Name</label>
                <input
                  type="text"
                  value={editingTask.name}
                  onChange={(e) => setEditingTask({...editingTask, name: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Project</label>
                <select
                  value={editingTask.projectId}
                  onChange={(e) => setEditingTask({...editingTask, projectId: parseInt(e.target.value)})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                >
                  {projectsState.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={editingTask.priority}
                  onChange={(e) => setEditingTask({...editingTask, priority: e.target.value})}
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
                  value={editingTask.deadline}
                  onChange={(e) => setEditingTask({...editingTask, deadline: e.target.value})}
                  className="w-full p-2 rounded-lg"
                  style={{ background: colors.cardHighlight }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={editingTask.notes}
                  onChange={(e) => setEditingTask({...editingTask, notes: e.target.value})}
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
                      setEditingTask({
                        ...editingTask,
                        steps: [...editingTask.steps, { id: Date.now(), description: '', completed: false }]
                      });
                    }}
                  >
                    Add Step
                  </button>
                </div>
                
                <div className="space-y-2">
                  {editingTask.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <button
                        className="p-1 rounded-full"
                        style={{ 
                          color: step.completed ? colors.primary : colors.text,
                          opacity: step.completed ? 1 : 0.5
                        }}
                        onClick={() => {
                          const updatedSteps = [...editingTask.steps];
                          updatedSteps[index].completed = !updatedSteps[index].completed;
                          setEditingTask({...editingTask, steps: updatedSteps});
                        }}
                      >
                        <CheckCircle size={16} />
                      </button>
                      
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => {
                          const updatedSteps = [...editingTask.steps];
                          updatedSteps[index].description = e.target.value;
                          setEditingTask({...editingTask, steps: updatedSteps});
                        }}
                        className="flex-grow p-2 rounded-lg"
                        style={{ 
                          background: colors.cardHighlight,
                          textDecoration: step.completed ? 'line-through' : 'none',
                          opacity: step.completed ? 0.7 : 1
                        }}
                        placeholder="Step description"
                      />
                      
                      {editingTask.steps.length > 1 && (
                        <button
                          className="p-1 rounded-full"
                          style={{ color: colors.dangerText }}
                          onClick={() => {
                            const updatedSteps = editingTask.steps.filter((_, i) => i !== index);
                            setEditingTask({...editingTask, steps: updatedSteps});
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
            
            <div className="p-4 border-t flex justify-between" style={{ borderColor: colors.cardHighlight }}>
              <button
                className="px-4 py-2 rounded-xl"
                style={{ background: colors.dangerBg, color: colors.dangerText }}
                onClick={() => handleDeleteTask(editingTask.id)}
              >
                <Trash2 size={16} className="inline mr-1" />
                Delete
              </button>
              
              <button
                className="px-4 py-2 rounded-xl"
                style={{ 
                  background: colors.buttonBg, 
                  color: colors.buttonText,
                  opacity: !editingTask.name ? 0.5 : 1 
                }}
                disabled={!editingTask.name}
                onClick={handleUpdateTask}
              >
                <CheckCircle size={16} className="inline mr-1" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 
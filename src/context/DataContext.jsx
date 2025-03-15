import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  saveJournalEntries, 
  loadJournalEntries,
  saveProjects,
  loadProjects,
  savePriorityTasks,
  loadPriorityTasks,
  saveAdminTasks,
  loadAdminTasks
} from '../utils/storageUtils';

// Create the data context
const DataContext = createContext();

// Custom hook to use the data context
export const useData = () => useContext(DataContext);

// Initial data
const initialJournalEntries = {};
const initialProjects = [];
const initialPriorityTasks = [];
const initialAdminTasks = [];
const initialReflections = [];
const initialMonthlyWrapUps = {};

// Data provider component
export const DataProvider = ({ children }) => {
  // Journal entries state
  const [journalEntries, setJournalEntries] = useState(initialJournalEntries);
  
  // Projects state
  const [projects, setProjects] = useState(initialProjects);
  
  // Tasks state
  const [priorityTasks, setPriorityTasks] = useState(initialPriorityTasks);
  const [adminTasks, setAdminTasks] = useState(initialAdminTasks);
  
  // Reflections state
  const [reflections, setReflections] = useState(initialReflections);
  
  // Monthly wrap-ups state
  const [monthlyWrapUps, setMonthlyWrapUps] = useState(initialMonthlyWrapUps);
  
  // Load data from storage on initial render
  useEffect(() => {
    const loadedJournalEntries = loadJournalEntries(initialJournalEntries);
    const loadedProjects = loadProjects(initialProjects);
    const loadedPriorityTasks = loadPriorityTasks(initialPriorityTasks);
    const loadedAdminTasks = loadAdminTasks(initialAdminTasks);
    
    setJournalEntries(loadedJournalEntries);
    setProjects(loadedProjects);
    setPriorityTasks(loadedPriorityTasks);
    setAdminTasks(loadedAdminTasks);
  }, []);
  
  // Save journal entries whenever they change
  useEffect(() => {
    saveJournalEntries(journalEntries);
  }, [journalEntries]);
  
  // Save projects whenever they change
  useEffect(() => {
    saveProjects(projects);
  }, [projects]);
  
  // Save priority tasks whenever they change
  useEffect(() => {
    savePriorityTasks(priorityTasks);
  }, [priorityTasks]);
  
  // Save admin tasks whenever they change
  useEffect(() => {
    saveAdminTasks(adminTasks);
  }, [adminTasks]);
  
  // Project CRUD operations
  const addProject = (project) => {
    const projectId = Date.now();
    const newProject = {
      ...project,
      id: projectId,
      progress: 0,
      createdAt: new Date().toISOString()
    };
    
    // Add the project and maintain sort by priority
    const updatedProjects = [...projects, newProject].sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setProjects(updatedProjects);
    
    return projectId;
  };
  
  const updateProject = (projectId, updates) => {
    const updatedProjects = projects.map(project => 
      project.id === projectId ? { ...project, ...updates } : project
    ).sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
    
    setProjects(updatedProjects);
  };
  
  const deleteProject = (projectId) => {
    // First, delete all tasks associated with this project
    const updatedTasks = priorityTasks.filter(task => task.projectId !== projectId);
    setPriorityTasks(updatedTasks);
    
    // Then delete the project
    const updatedProjects = projects.filter(project => project.id !== projectId);
    setProjects(updatedProjects);
  };
  
  // Task CRUD operations
  const addTask = (task) => {
    const taskId = Date.now();
    const newTask = {
      ...task,
      id: taskId,
      createdAt: new Date().toISOString(),
      completed: false
    };
    
    const updatedTasks = [...priorityTasks, newTask];
    setPriorityTasks(updatedTasks);
    
    // Update project progress if task is associated with a project
    if (task.projectId) {
      updateProjectProgress(task.projectId);
    }
    
    return taskId;
  };
  
  const updateTask = (taskId, updates) => {
    const task = priorityTasks.find(t => t.id === taskId);
    const projectId = task?.projectId;
    
    const updatedTasks = priorityTasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    setPriorityTasks(updatedTasks);
    
    // If the task is associated with a project, update project progress
    if (projectId) {
      updateProjectProgress(projectId);
    }
  };
  
  const deleteTask = (taskId) => {
    const task = priorityTasks.find(t => t.id === taskId);
    const projectId = task?.projectId;
    
    const updatedTasks = priorityTasks.filter(task => task.id !== taskId);
    setPriorityTasks(updatedTasks);
    
    // If the task was associated with a project, update project progress
    if (projectId) {
      updateProjectProgress(projectId);
    }
  };
  
  // Admin task CRUD operations
  const addAdminTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      completed: false
    };
    
    const updatedTasks = [...adminTasks, newTask];
    setAdminTasks(updatedTasks);
  };
  
  const updateAdminTask = (taskId, updates) => {
    const updatedTasks = adminTasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    setAdminTasks(updatedTasks);
  };
  
  const deleteAdminTask = (taskId) => {
    const updatedTasks = adminTasks.filter(task => task.id !== taskId);
    setAdminTasks(updatedTasks);
  };
  
  // Calculate and update project progress based on completed tasks
  const updateProjectProgress = (projectId) => {
    const projectTasks = priorityTasks.filter(task => task.projectId === projectId);
    
    if (projectTasks.length === 0) {
      updateProject(projectId, { progress: 0 });
      return;
    }
    
    const completedTasks = projectTasks.filter(task => task.completed);
    const progress = Math.round((completedTasks.length / projectTasks.length) * 100);
    
    updateProject(projectId, { progress });
  };
  
  // Value to be provided by the context
  const value = {
    // Data
    journalEntries,
    projects,
    priorityTasks,
    adminTasks,
    
    // Setters
    setJournalEntries,
    
    // Project operations
    addProject,
    updateProject,
    deleteProject,
    
    // Task operations
    addTask,
    updateTask,
    deleteTask,
    
    // Admin task operations
    addAdminTask,
    updateAdminTask,
    deleteAdminTask,
    
    // Helper functions
    updateProjectProgress
  };
  
  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}; 
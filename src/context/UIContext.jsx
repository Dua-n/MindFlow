import React, { createContext, useState, useContext } from 'react';

// Create the UI context
const UIContext = createContext();

// Custom hook to use the UI context
export const useUI = () => useContext(UIContext);

// UI provider component
export const UIProvider = ({ children }) => {
  // Navigation state
  const [activeTab, setActiveTab] = useState('journal');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Modal states
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAdminTaskModalOpen, setIsAdminTaskModalOpen] = useState(false);
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  
  // Selected item states
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedAdminTaskId, setSelectedAdminTaskId] = useState(null);
  const [selectedJournalDate, setSelectedJournalDate] = useState(null);
  
  // Focus mode state
  const [currentFocusTaskId, setCurrentFocusTaskId] = useState(null);
  const [isFocusModeActive, setIsFocusModeActive] = useState(false);
  
  // Assistant state
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // Modal handlers
  const openProjectModal = (projectId = null) => {
    setSelectedProjectId(projectId);
    setIsProjectModalOpen(true);
  };
  
  const closeProjectModal = () => {
    setSelectedProjectId(null);
    setIsProjectModalOpen(false);
  };
  
  const openTaskModal = (taskId = null) => {
    setSelectedTaskId(taskId);
    setIsTaskModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setSelectedTaskId(null);
    setIsTaskModalOpen(false);
  };
  
  const openAdminTaskModal = (taskId = null) => {
    setSelectedAdminTaskId(taskId);
    setIsAdminTaskModalOpen(true);
  };
  
  const closeAdminTaskModal = () => {
    setSelectedAdminTaskId(null);
    setIsAdminTaskModalOpen(false);
  };
  
  const openJournalModal = (date = null) => {
    setSelectedJournalDate(date);
    setIsJournalModalOpen(true);
  };
  
  const closeJournalModal = () => {
    setSelectedJournalDate(null);
    setIsJournalModalOpen(false);
  };
  
  const openReflectionModal = () => {
    setIsReflectionModalOpen(true);
  };
  
  const closeReflectionModal = () => {
    setIsReflectionModalOpen(false);
  };
  
  // Focus mode handlers
  const startFocusMode = (taskId) => {
    setCurrentFocusTaskId(taskId);
    setIsFocusModeActive(true);
    setActiveTab('focus');
  };
  
  const endFocusMode = () => {
    setCurrentFocusTaskId(null);
    setIsFocusModeActive(false);
  };
  
  // Navigation handlers
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  const toggleAssistant = () => {
    setIsAssistantOpen(prev => !prev);
  };
  
  // Value to be provided by the context
  const value = {
    // Navigation state
    activeTab,
    setActiveTab,
    sidebarOpen,
    toggleSidebar,
    
    // Modal states and handlers
    isProjectModalOpen,
    isTaskModalOpen,
    isAdminTaskModalOpen,
    isJournalModalOpen,
    isReflectionModalOpen,
    openProjectModal,
    closeProjectModal,
    openTaskModal,
    closeTaskModal,
    openAdminTaskModal,
    closeAdminTaskModal,
    openJournalModal,
    closeJournalModal,
    openReflectionModal,
    closeReflectionModal,
    
    // Selected item states
    selectedProjectId,
    selectedTaskId,
    selectedAdminTaskId,
    selectedJournalDate,
    
    // Focus mode state and handlers
    currentFocusTaskId,
    isFocusModeActive,
    startFocusMode,
    endFocusMode,
    
    // Assistant state and handlers
    isAssistantOpen,
    toggleAssistant
  };
  
  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}; 
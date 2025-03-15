// Storage keys
export const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'mindflow_journal_entries',
  JOURNAL_ANALYSIS: 'mindflow_journal_analysis',
  PROJECTS: 'mindflow_projects',
  PRIORITY_TASKS: 'mindflow_priority_tasks',
  ADMIN_TASKS: 'mindflow_admin_tasks',
  REFLECTIONS: 'mindflow_reflections',
  MONTHLY_WRAPUPS: 'mindflow_monthly_wrapups',
  USER_SETTINGS: 'mindflow_user_settings'
};

// Generic storage operations
const storage = {
  save: (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error(`Error saving data for key ${key}:`, error);
      return false;
    }
  },

  load: (key, defaultValue = null) => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error(`Error loading data for key ${key}:`, error);
      return defaultValue;
    }
  },

  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing data for key ${key}:`, error);
      return false;
    }
  },

  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  }
};

// Specific data operations
export const saveJournalEntries = (entries) => 
  storage.save(STORAGE_KEYS.JOURNAL_ENTRIES, entries);

export const loadJournalEntries = (defaultEntries = {}) => 
  storage.load(STORAGE_KEYS.JOURNAL_ENTRIES, defaultEntries);

export const saveJournalAnalysis = (analysis) =>
  storage.save(STORAGE_KEYS.JOURNAL_ANALYSIS, analysis);

export const loadJournalAnalysis = (defaultAnalysis = {}) =>
  storage.load(STORAGE_KEYS.JOURNAL_ANALYSIS, defaultAnalysis);

export const saveProjects = (projects) =>
  storage.save(STORAGE_KEYS.PROJECTS, projects);

export const loadProjects = (defaultProjects = []) =>
  storage.load(STORAGE_KEYS.PROJECTS, defaultProjects);

export const savePriorityTasks = (tasks) =>
  storage.save(STORAGE_KEYS.PRIORITY_TASKS, tasks);

export const loadPriorityTasks = (defaultTasks = []) =>
  storage.load(STORAGE_KEYS.PRIORITY_TASKS, defaultTasks);

export const saveAdminTasks = (tasks) =>
  storage.save(STORAGE_KEYS.ADMIN_TASKS, tasks);

export const loadAdminTasks = (defaultTasks = []) =>
  storage.load(STORAGE_KEYS.ADMIN_TASKS, defaultTasks);

export const saveReflections = (reflections) =>
  storage.save(STORAGE_KEYS.REFLECTIONS, reflections);

export const loadReflections = (defaultReflections = []) =>
  storage.load(STORAGE_KEYS.REFLECTIONS, defaultReflections);

export const saveMonthlyWrapUps = (wrapUps) =>
  storage.save(STORAGE_KEYS.MONTHLY_WRAPUPS, wrapUps);

export const loadMonthlyWrapUps = (defaultWrapUps = {}) =>
  storage.load(STORAGE_KEYS.MONTHLY_WRAPUPS, defaultWrapUps);

export const saveUserSettings = (settings) =>
  storage.save(STORAGE_KEYS.USER_SETTINGS, settings);

export const loadUserSettings = (defaultSettings = {}) =>
  storage.load(STORAGE_KEYS.USER_SETTINGS, defaultSettings);

export default storage; 
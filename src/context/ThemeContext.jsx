import React, { createContext, useState, useContext, useEffect } from 'react';
import { lightTheme, darkTheme } from '../utils/themeUtils';
import { saveUserSettings, loadUserSettings } from '../utils/storageUtils';

// Create the theme context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from local storage or default to light
  const [darkMode, setDarkMode] = useState(false);
  
  // Load theme preference from storage on initial render
  useEffect(() => {
    const userSettings = loadUserSettings({});
    if (userSettings.darkMode !== undefined) {
      setDarkMode(userSettings.darkMode);
    }
  }, []);
  
  // Save theme preference whenever it changes
  useEffect(() => {
    const userSettings = loadUserSettings({});
    saveUserSettings({ ...userSettings, darkMode });
  }, [darkMode]);
  
  // Toggle between light and dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };
  
  // Get the current theme colors
  const colors = darkMode ? darkTheme : lightTheme;
  
  // Value to be provided by the context
  const value = {
    darkMode,
    toggleDarkMode,
    colors
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 
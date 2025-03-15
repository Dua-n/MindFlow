import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { DataProvider } from './DataContext';
import { UIProvider } from './UIContext';

export const RootProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <DataProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </DataProvider>
    </ThemeProvider>
  );
}; 
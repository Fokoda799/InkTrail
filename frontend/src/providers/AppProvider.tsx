// src/providers/AppProviders.tsx
import React from 'react';
import { AuthProvider } from '../context/authContext';
import { DataProvider } from '../context/dataContext';
import { positions, Provider as AlertProvider, AlertTemplateProps, AlertTransition } from 'react-alert';
import AlertTemplate from '../components/Alert/AlertTemplate';
import { SearchProvider } from '../context/searchContext';

const CompatibleAlertTemplate = AlertTemplate as React.ComponentType<AlertTemplateProps>;

// Wrapper component to suppress the warning
const AlertProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const alertOptions = {
    timeout: 5000,
    position: positions.BOTTOM_LEFT,
    offset: '1rem',
    transition: 'fade' as AlertTransition,
  };

  return (
    <AlertProvider template={CompatibleAlertTemplate} {...alertOptions}>
      {children}
    </AlertProvider>
  );
};

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AlertProviderWrapper>
      <AuthProvider>
        <DataProvider>
          <SearchProvider>
            {children}
          </SearchProvider>
        </DataProvider>
      </AuthProvider>
    </AlertProviderWrapper>
  );
};

export default AppProviders;
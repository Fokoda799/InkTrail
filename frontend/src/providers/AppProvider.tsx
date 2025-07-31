// src/providers/AppProviders.tsx
import React from 'react';
import { AuthProvider } from '../context/authContext';
import { DataProvider } from '../context/DataContext';
import { positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from '../components/Alert/AlertTemplate';

// Wrapper component to suppress the warning
const AlertProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const alertOptions = {
    timeout: 5000,
    position: positions.TOP_LEFT,
    offset: '1rem',
    transition: 'fade',
  };

  return (
    <AlertProvider template={AlertTemplate} {...alertOptions}>
      {children}
    </AlertProvider>
  );
};

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AlertProviderWrapper>
      <AuthProvider>
        <DataProvider>
          {children}
        </DataProvider>
      </AuthProvider>
    </AlertProviderWrapper>
  );
};

export default AppProviders;
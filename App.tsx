import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { DownloadsProvider } from './src/context/DownloadsContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DownloadsProvider>
          <StatusBar style="light" />
          <RootNavigator />
        </DownloadsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

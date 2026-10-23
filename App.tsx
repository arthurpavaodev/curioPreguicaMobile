import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from './src/app/providers/AppDataProvider';
import { ThemeProvider } from './src/app/providers/ThemeProvider';
import { RootNavigator } from './src/app/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppDataProvider>
          <RootNavigator />
        </AppDataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

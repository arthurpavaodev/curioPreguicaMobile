import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ContainerProvider } from './src/main';
import { ThemeProvider } from './src/adapters/in/ui/theme/ThemeContext';
import { RootNavigator } from './src/adapters/in/ui/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <ContainerProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </ContainerProvider>
    </SafeAreaProvider>
  );
}

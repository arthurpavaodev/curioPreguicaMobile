import React, { createContext, useContext, useMemo } from 'react';
import { criarContainer, DependencyContainer } from './container';

const ContainerContext = createContext<DependencyContainer | null>(null);

export interface ContainerProviderProps {
  container?: DependencyContainer;
  children: React.ReactNode;
}

export function ContainerProvider({ container, children }: ContainerProviderProps) {
  const containerInstance = useMemo(() => container ?? criarContainer(), [container]);

  return (
    <ContainerContext.Provider value={containerInstance}>
      {children}
    </ContainerContext.Provider>
  );
}

export function useContainer(): DependencyContainer {
  const context = useContext(ContainerContext);
  if (!context) {
    throw new Error('useContainer deve ser usado dentro de um ContainerProvider.');
  }
  return context;
}

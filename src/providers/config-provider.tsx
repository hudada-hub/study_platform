'use client';

import React, { createContext, useContext } from 'react';
import { ConfigValue } from '@/types/config';
import { Wiki } from '@/types/wiki';

interface ConfigContextType {
  configs: ConfigValue[];

}

const ConfigContext = createContext<ConfigContextType>({
  configs: [],
});

export const useConfig = () => useContext(ConfigContext);

interface ConfigProviderProps {
  children: React.ReactNode;
  configs: ConfigValue[];
 
}

export function ConfigProvider({ children, configs }: ConfigProviderProps) {
  return (
    <ConfigContext.Provider value={{ configs }}>
      {children}
    </ConfigContext.Provider>
  );
} 
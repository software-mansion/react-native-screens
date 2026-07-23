import React from 'react';
import type { TabsHostConfig } from '../TabsContainer.types';

export type TabsHostConfigContextPayload = {
  hostConfig: TabsHostConfig;
  updateHostConfig: (config: Partial<TabsHostConfig>) => void;
};

export const TabsHostConfigContext =
  React.createContext<TabsHostConfigContextPayload | null>(null);

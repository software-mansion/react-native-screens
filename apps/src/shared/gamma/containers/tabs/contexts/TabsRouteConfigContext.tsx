import React from 'react';
import type { TabRouteConfig, TabRouteOptions } from '../TabsContainer.types';

export type TabsRouteConfigContextPayload = {
  routeConfigs: TabRouteConfig[];
  updateRouteConfigWithOptions: (
    name: string,
    options: Partial<TabRouteOptions>,
  ) => void;
};

export const TabsRouteConfigContext =
  React.createContext<TabsRouteConfigContextPayload | null>(null);

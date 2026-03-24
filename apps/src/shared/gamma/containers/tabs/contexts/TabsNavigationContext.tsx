import React from 'react';
import type { TabRouteOptions, SetTabOptionsMethod } from '../TabsContainer.types';

export type TabsNavigationContextPayload = {
  routeKey: string;
  routeOptions: TabRouteOptions;
  setRouteOptions: SetTabOptionsMethod;
};

export const TabsNavigationContext =
  React.createContext<TabsNavigationContextPayload | null>(null);

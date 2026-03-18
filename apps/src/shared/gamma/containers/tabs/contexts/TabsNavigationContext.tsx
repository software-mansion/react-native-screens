import React from 'react';
import type {
  TabRouteOptions,
  SetTabOptionsMethod,
  ChangeTabMethod,
} from '../TabsContainer.types';

export type TabsNavigationContextPayload = {
  routeKey: string;
  routeOptions: TabRouteOptions;
  setRouteOptions: SetTabOptionsMethod;
  changeTabTo: ChangeTabMethod;
  isSelected: boolean;
  shouldRenderContents: boolean;
};

export const TabsNavigationContext =
  React.createContext<TabsNavigationContextPayload | null>(null);

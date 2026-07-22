import React from 'react';
import type {
  StackRouteConfig,
  StackRouteOptions,
} from '../StackContainer.types';

export type StackRouteConfigContextPayload = {
  routeConfigs: StackRouteConfig[];
  updateRouteConfigWithOptions: (
    routeName: string,
    options: Partial<StackRouteOptions>,
  ) => void;
};

export const StackRouteConfigContext =
  React.createContext<StackRouteConfigContextPayload | null>(null);

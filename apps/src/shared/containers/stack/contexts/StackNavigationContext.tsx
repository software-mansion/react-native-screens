import React from 'react';
import type {
  BatchActionMethod,
  PopActionMethod,
  PreloadActionMethod,
  PushActionMethod,
  SetRouteOptionsActionMethod,
  StackRouteOptions,
} from '../StackContainer.types';

export type StackNavigationContextPayload = {
  routeKey: string;
  routeOptions: StackRouteOptions;
  push: PushActionMethod;
  pop: PopActionMethod;
  preload: PreloadActionMethod;
  batch: BatchActionMethod;
  setRouteOptions: SetRouteOptionsActionMethod;
};

export const StackNavigationContext =
  React.createContext<StackNavigationContextPayload | null>(null);

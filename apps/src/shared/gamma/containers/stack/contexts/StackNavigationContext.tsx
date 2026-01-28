import React from 'react';
import type {
  BatchActionMethod,
  PopActionMethod,
  PreloadActionMethod,
  PushActionMethod,
} from '../StackContainer.types';

export type StackNavigationContextPayload = {
  routeKey: string;
  push: PushActionMethod;
  pop: PopActionMethod;
  preload: PreloadActionMethod;
  batch: BatchActionMethod;
};

export const StackNavigationContext =
  React.createContext<StackNavigationContextPayload | null>(null);

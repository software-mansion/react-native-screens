import React from 'react';
import { StackScreenProps } from 'react-native-screens/experimental';

export type StackRouteOptions = Omit<
  StackScreenProps,
  'children' | 'activityMode' | 'screenKey'
>;

export type StackRouteConfig = {
  name: string;
  Component: React.ComponentType;
  options: StackRouteOptions;
};

export type StackContainerProps = {
  routeConfigs: StackRouteConfig[];
};

export type StackRoute = StackRouteConfig & {
  activityMode: StackScreenProps['activityMode'];
  routeKey: StackScreenProps['screenKey'];
};

export type PushActionMethod = (routeName: string) => void;
export type PopActionMethod = (routeKey: string) => void;
export type PopCompletedActionMethod = (routeKey: string) => void;
export type PopNativeActionMethod = (routeKey: string) => void;
export type PreloadActionMethod = (routeName: string) => void;
export type BatchActionMethod = (actions: BatchableNavigationAction[]) => void;

export type NavigationActionMethods = {
  pushAction: PushActionMethod;
  popAction: PopActionMethod;
  popCompletedAction: PopCompletedActionMethod;
  popNativeAction: PopNativeActionMethod;
  preloadAction: PreloadActionMethod;
  batchAction: BatchActionMethod;
};

export type StackState = StackRoute[];

export type NavigationActionPush = {
  type: 'push';
  routeName: string;
  ctx: NavigationActionContext;
};

export type NavigationActionPop = {
  type: 'pop';
  routeKey: string;
  ctx: NavigationActionContext;
};

export type NavigationActionPopCompleted = {
  type: 'pop-completed';
  routeKey: string;
  ctx: NavigationActionContext;
};

export type NavigationActionNativePop = {
  type: 'pop-native';
  routeKey: string;
  ctx: NavigationActionContext;
};

export type NavigationActionPreload = {
  type: 'preload';
  routeName: string;
  ctx: NavigationActionContext;
};

export type NavigationActionBatch = {
  type: 'batch';
  actions: Exclude<NavigationAction, NavigationActionBatch>[];
};

export type NavigationActionContext = {
  routeConfigs: StackRouteConfig[];
};

export type BatchableNavigationAction =
  | Omit<NavigationActionPush, 'ctx'>
  | Omit<NavigationActionPop, 'ctx'>
  | Omit<NavigationActionPreload, 'ctx'>;

export type NavigationAction =
  | NavigationActionPush
  | NavigationActionPop
  | NavigationActionPopCompleted
  | NavigationActionNativePop
  | NavigationActionPreload
  | NavigationActionBatch;

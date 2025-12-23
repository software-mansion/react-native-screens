import React from 'react';
import { StackScreenProps } from 'react-native-screens/experimental';

export type StackRouteOptions = Omit<
  StackScreenProps,
  'children' | 'activityMode' | 'screenKey'
>;

export type StackRouteConfig = {
  name: string;
  Component: () => React.ReactNode;
  options: StackRouteOptions;
};

export type StackContainerProps = {
  routeConfigs: StackRouteConfig[];
};

// Possibly private?

export type StackRoute = StackRouteConfig & {
  activityMode: StackScreenProps['activityMode'];
  routeKey: StackScreenProps['screenKey'];
};

export type PushActionMethod = (routeName: string) => void;
export type PopActionMethod = (routeKey: string) => void;
export type PopCompletedActionMethod = (routeKey: string) => void;
export type PopNativeActionMethod = (routeKey: string) => void;

export type NavigationActionMethods = {
  pushAction: PushActionMethod;
  popAction: PopActionMethod;
  popCompletedAction: PopCompletedActionMethod;
  popNativeAction: PopNativeActionMethod;
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
  type: 'pop-complated';
  routeKey: string;
  ctx: NavigationActionContext;
};

export type NavigationActionNativePop = {
  type: 'pop-native';
  routeKey: string;
  ctx: NavigationActionContext;
};

export type NavigationActionContext = {
  routeConfigs: StackRouteConfig[];
  routesByName: Record<string, StackRouteConfig>;
};

export type NavigationAction =
  | NavigationActionPush
  | NavigationActionPop
  | NavigationActionPopCompleted
  | NavigationActionNativePop;

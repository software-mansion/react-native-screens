import React from 'react';
import { StackScreenProps } from 'react-native-screens/experimental';

/// Route definition

export type StackRouteOptions = Omit<
  StackScreenProps,
  'children' | 'activityMode' | 'screenKey'
>;

/**
 * Blueprint for a route.
 */
export type StackRouteConfig = {
  name: string;
  Component: React.ComponentType;
  options: StackRouteOptions;
};

export type StackRoute = StackRouteConfig & {
  activityMode: StackScreenProps['activityMode'];
  routeKey: StackScreenProps['screenKey'];
};

/// StackContainer props

export type StackContainerProps = {
  routeConfigs: StackRouteConfig[];
};

export type PushActionMethod = (routeName: string) => void;
export type PopActionMethod = (routeKey: string) => void;
export type PopCompletedActionMethod = (routeKey: string) => void;
export type PopNativeActionMethod = (routeKey: string) => void;
export type PreloadActionMethod = (routeName: string) => void;
export type BatchActionMethod = (actions: BatchableNavigationAction[]) => void;
export type SetRouteOptionsActionMethod = (
  routeKey: string,
  options: Partial<StackRouteOptions>,
) => void;
export type ClearEffectsActionMethod = () => void;

export type NavigationActionMethods = {
  pushAction: PushActionMethod;
  popAction: PopActionMethod;
  popCompletedAction: PopCompletedActionMethod;
  popNativeAction: PopNativeActionMethod;
  preloadAction: PreloadActionMethod;
  batchAction: BatchActionMethod;
  clearEffectsAction: ClearEffectsActionMethod;
  /**
   * Change options for the current route. This does not modify a blueprint
   * (StackRouteConfig) for the route. It only modifies options for the
   * given route instance.
   */
  setRouteOptions: SetRouteOptionsActionMethod;
};

export type StackState = StackRoute[];

export type StackNavigationState = {
  stack: StackState;
  effects: StackNavigationEffect[];
};

export type StackNavigationEffect = PopContainerStackNavigationEffect;

type PopContainerStackNavigationEffect = {
  type: 'pop-container';
};

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

// TODO: We need to separate navigation actions exposed to user from internal
// state manipulation done in stack container on the type level.
export type NavigationActionClearEffects = {
  type: 'clear-effects';
  ctx: NavigationActionContext;
};

export type NavigationActionSetRouteOptions = {
  type: 'set-options';
  routeKey: string;
  options: Partial<StackRouteOptions>;
  ctx: NavigationActionContext;
};

export type NavigationActionContext = {
  routeConfigs: StackRouteConfig[];
};

export type BatchableNavigationAction =
  | Omit<NavigationActionPush, 'ctx'>
  | Omit<NavigationActionPop, 'ctx'>
  | Omit<NavigationActionPreload, 'ctx'>
  | Omit<NavigationActionSetRouteOptions, 'ctx'>;

export type NavigationAction =
  | NavigationActionPush
  | NavigationActionPop
  | NavigationActionPopCompleted
  | NavigationActionNativePop
  | NavigationActionPreload
  | NavigationActionClearEffects
  | NavigationActionSetRouteOptions
  | NavigationActionBatch;

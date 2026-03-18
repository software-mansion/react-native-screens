import React from 'react';
import type {
  TabChangeEvent,
  TabsHostProps,
  TabsScreenProps,
} from 'react-native-screens';
import type { SafeAreaViewProps } from '../../../../../../src/components/safe-area/SafeAreaView.types';

/// Route definition

export type TabRouteOptions = Omit<
  TabsScreenProps,
  'children' | 'screenKey' | 'isFocused'
> & {
  safeAreaConfiguration?: SafeAreaViewProps;
};

/**
 * Blueprint for a tab route.
 */
export type TabRouteConfig = {
  name: string;
  Component: React.ComponentType;
  options?: TabRouteOptions;
};

/**
 * Runtime instance of a tab route. Created from a TabRouteConfig blueprint.
 */
export type TabRoute = TabRouteConfig & {
  routeKey: string;
};

export type TabsNavState = {
  selectedRouteKey: string;
  provenance: number;
};

export type TabsContainerState = {
  routes: TabRoute[];
  /**
   * State as last confirmed by the native side.
   *
   * During initial render it is filled immediately & aligned with suggestedState.
   */
  confirmedState: TabsNavState;
  /**
   * State as last send to the native side.
   */
  suggestedState: TabsNavState;
};

/// Navigation actions

export type TabsNavigationActionChangeTab = {
  type: 'tab-change';
  routeKey: string;
};

export type TabsNavigationActionNativeChangeTab = {
  type: 'native-tab-change';
  routeKey: string;
  nativeEvent: TabChangeEvent;
};

export type TabsNavigationActionSetOptions = {
  type: 'set-options';
  routeKey: string;
  options: Partial<TabRouteOptions>;
};

export type TabsNavigationAction =
  | TabsNavigationActionChangeTab
  | TabsNavigationActionSetOptions
  | TabsNavigationActionNativeChangeTab;

/// TabsContainer props

export type TabsHostConfig = Omit<
  TabsHostProps,
  'children' | 'onNativeFocusChange' | 'experimentalControlNavigationStateInJS'
>;

export type TabsContainerProps = Omit<
  TabsHostProps,
  'children' | 'navState'
> & {
  routeConfigs: TabRouteConfig[];
  /**
   * Name of the tab that should be focused initially.
   * Defaults to the first tab if not provided.
   */
  initialFocusedName?: string;
  /**
   * Whether to control navigation state in JS.
   * Passed to Tabs.Host as experimentalControlNavigationStateInJS.
   */
  experimentalControlNavigationStateInJS?: boolean;
};

export type SetTabOptionsMethod = (
  routeKey: string,
  options: Partial<TabRouteOptions>,
) => void;

export type ChangeTabMethod = (routeKey: string) => void;

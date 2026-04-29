import React from 'react';
import type {
  TabSelectedEvent,
  TabsHostProps,
  TabsScreenProps,
} from 'react-native-screens';
import type { SafeAreaViewProps } from '../../../../../../src/components/safe-area/SafeAreaView.types';

/// Route definition

export type TabRouteOptions = Omit<
  TabsScreenProps,
  'children' | 'screenKey'
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

/// Navigation actions (reducer)

export type TabsNavigationActionSelectTab = {
  type: 'tab-select';
  routeKey: string;
  forceAction: boolean;
};

export type TabsNavigationActionNativeSelectTab = {
  type: 'native-tab-select';
  routeKey: string;
  nativeEvent: TabSelectedEvent;
};

export type TabsNavigationActionSetOptions = {
  type: 'set-options';
  routeKey: string;
  options: Partial<TabRouteOptions>;
};

export type TabsNavigationAction =
  | TabsNavigationActionSelectTab
  | TabsNavigationActionSetOptions
  | TabsNavigationActionNativeSelectTab;

/// TabsContainer props

export type TabsHostConfig = Omit<
  TabsHostProps,
  | 'children'
  | 'navState'
>;

export type TabsContainerProps = Omit<
  TabsHostProps,
  'children' | 'navState'
> & {
  routeConfigs: TabRouteConfig[];
  /**
   * @summary
   * Name of the tab that should be selected initially.
   * Defaults to the first tab if not provided.
   */
  defaultRouteName?: string;
};

export type SetTabOptionsMethod = (
  routeKey: string,
  options: Partial<TabRouteOptions>,
) => void;

export type SelectTabMethod = (routeKey: string, forceAction?: boolean) => void;

/// Navigation methods (user facing)

export type TabsNavigationMethods = {
  setRouteOptions: SetTabOptionsMethod;
  selectTab: SelectTabMethod;
}

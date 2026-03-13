import React from 'react';
import type {
  TabsHostProps,
  TabsScreenProps,
} from 'react-native-screens';
import type { SafeAreaViewProps } from '../../../../../../src/components/safe-area/SafeAreaView.types';

/// Route definition

export type TabRouteOptions = Omit<
  TabsScreenProps,
  'children' | 'screenKey' | 'isFocused'
>;

/**
 * Blueprint for a tab route.
 */
export type TabRouteConfig = {
  name: string;
  Component: React.ComponentType;
  options?: TabRouteOptions;
  safeAreaConfiguration?: SafeAreaViewProps;
};

/// TabsContainer props

export type TabsContainerProps = Omit<TabsHostProps, 'children'> & {
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
  name: string,
  options: Partial<TabRouteOptions>,
) => void;

import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4989
//
// On an iPhone Duo, TabsHost launched while the device is unfolded comes up
// without its tab bar: the side rail on the inner display never appears.
// Render this test directly from `apps/App.tsx` so that the tabs are mounted on
// a cold launch.

function ContentView() {
  const { routeKey } = useTabsNavigationContext();
  return (
    <CenteredLayoutView style={styles.content}>
      <Text style={styles.title}>{routeKey}</Text>
      <Text style={styles.step}>
        1. On an iPhone Duo, unfold the device and cold-launch the app.
      </Text>
      <Text style={styles.step}>
        2. Expected: the side rail tab bar with First, Second and Third is shown
        on the inner display.
      </Text>
      <Text style={styles.step}>
        3. Fold and unfold the device: the tab bar stays visible.
      </Text>
    </CenteredLayoutView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'First',
    element: <ContentView />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'First',
    },
  },
  {
    name: 'Second',
    element: <ContentView />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Second',
    },
  },
  {
    name: 'Third',
    element: <ContentView />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Third',
    },
  },
];

export default function Test4989() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  step: {
    fontSize: 14,
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';

const scenarioDescription: ScenarioDescription = {
  name: 'Tabs scrollToTop special effect',
  key: 'test-tabs-special-effects',
  details:
    'Test settings of scrollToTop specialEffect.',
  platforms: ['ios', 'android'],
};

function ScrollScreen() {
  return (
    <ScrollView>
      <Text style={styles.hint}>Scroll Screen — scroll down or re-tap the tab.</Text>
      {Array.from({ length: 50 }, (_, i) => (
        <Text key={i} style={styles.item}>
          Item {i + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

const TAB_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: ScrollScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
      specialEffects: {
        repeatedTabSelection: {
          popToRoot: false,
          scrollToTop: true,
        },
      },
    },
  },
  {
    name: 'Tab2',
    Component: ScrollScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
      specialEffects: {
        repeatedTabSelection: {
          popToRoot: false,
          scrollToTop: false
        },
      },
    },
  },
  {
    name: 'Tab3',
    Component: ScrollScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab3',
    },
  },
];

export function App() {
  return <TabsContainer routeConfigs={TAB_CONFIGS} />;
}

export default createScenario(App, scenarioDescription);

const styles = StyleSheet.create({
  config: {
    padding: 40,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  switch: {
    marginTop: 20,
    marginBottom: 15,
  },
  hint: {
    padding: 16,
    color: '#666',
  },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
});

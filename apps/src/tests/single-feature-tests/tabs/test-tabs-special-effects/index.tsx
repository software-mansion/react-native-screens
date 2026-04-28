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

function Tab1Screen() {
  return (
    <ScrollView testID="tab1-scrollview">
      <Text style={styles.hint}>Scroll Screen — scroll down or re-tap the tab.</Text>
      {Array.from({ length: 50 }, (_, i) => (
        <Text key={i} testID={`tab1-item-${i + 1}`} style={styles.item}>
          Item {i + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

function Tab2Screen() {
  return (
    <ScrollView testID="tab2-scrollview">
      <Text style={styles.hint}>Scroll Screen — scroll down or re-tap the tab.</Text>
      {Array.from({ length: 50 }, (_, i) => (
        <Text key={i} testID={`tab2-item-${i + 1}`} style={styles.item}>
          Item {i + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

function Tab3Screen() {
  return (
    <ScrollView testID="tab3-scrollview">
      <Text style={styles.hint}>Scroll Screen — scroll down or re-tap the tab.</Text>
      {Array.from({ length: 50 }, (_, i) => (
        <Text key={i} testID={`tab3-item-${i + 1}`} style={styles.item}>
          Item {i + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

const TAB_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: Tab1Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
      tabBarItemTestID: 'tab1-tab-item',
      specialEffects: {
        repeatedTabSelection: {
          scrollToTop: true,
        },
      },
    },
  },
  {
    name: 'Tab2',
    Component: Tab2Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
      tabBarItemTestID: 'tab2-tab-item',
      specialEffects: {
        repeatedTabSelection: {
          scrollToTop: false,
        },
      },
    },
  },
  {
    name: 'Tab3',
    Component: Tab3Screen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab3',
      tabBarItemTestID: 'tab3-tab-item',
    },
  },
];

export function App() {
  return <TabsContainer routeConfigs={TAB_CONFIGS} />;
}

export default createScenario(App, scenarioDescription);

const styles = StyleSheet.create({
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

import React from 'react';
import { Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { SafeAreaView } from 'react-native-screens/experimental';

interface ScrollScreenProps {
  tabName: string;
}

function ScrollScreen({ tabName }: ScrollScreenProps) {
  return (
    <SafeAreaView
      edges={{
        bottom: Platform.OS === 'android',
        top: Platform.OS === 'android',
      }}>
      <ScrollView testID={`${tabName}-scrollview`}>
        <Text style={styles.hint}>
          Scroll Screen — scroll down or re-tap the tab.
        </Text>
        {Array.from({ length: 50 }, (_, i) => (
          <Text key={i} testID={`${tabName}-item-${i + 1}`} style={styles.item}>
            Item {i + 1}
          </Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const TAB_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: () => <ScrollScreen tabName="tab1" />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
      tabBarItemTestID: 'tab1-tab-item',
      tabBarItemAccessibilityLabel: 'tab1-tab-item-label',
      specialEffects: {
        repeatedTabSelection: {
          scrollToTop: true,
        },
      },
    },
  },
  {
    name: 'Tab2',
    Component: () => <ScrollScreen tabName="tab2" />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
      tabBarItemTestID: 'tab2-tab-item',
      tabBarItemAccessibilityLabel: 'tab2-tab-item-label',
      specialEffects: {
        repeatedTabSelection: {
          scrollToTop: false,
        },
      },
    },
  },
  {
    name: 'Tab3',
    Component: () => <ScrollScreen tabName="tab3" />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab3',
      tabBarItemTestID: 'tab3-tab-item',
      tabBarItemAccessibilityLabel: 'tab3-tab-item-label',
    },
  },
];

export function TestTabsSpecialEffectsScrollToTop() {
  return <TabsContainer routeConfigs={TAB_CONFIGS} />;
}

export default createScenario(TestTabsSpecialEffectsScrollToTop, scenarioDescription);

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

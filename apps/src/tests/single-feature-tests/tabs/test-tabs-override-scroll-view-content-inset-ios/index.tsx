import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { TabsContainer } from '@apps/shared/gamma/containers/tabs';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Override ScrollView Content Inset',
  key: 'test-tabs-override-scroll-view-content-inset-ios',
  details:
    'Tests overrideScrollViewContentInsetAdjustmentBehavior with different static values per tab. ' +
    'False: content scrolls behind bars. True/Default: content is inset from bars.',
  platforms: ['ios'],
};

const ITEM_COUNT = 30;

export function ScrollContent({
  label,
  testID,
}: {
  label: string;
  testID: string;
}) {
  return (
    <ScrollView style={styles.scrollView} testID={testID}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          overrideScrollViewContentInsetAdjustmentBehavior: {label}
        </Text>
      </View>
      {Array.from({ length: ITEM_COUNT }, (_, i) => (
        <View key={i} style={styles.item}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function FalseTab() {
  return (
    <ScrollContent
      label="false"
      testID="override-inset-false-scrollview"
    />
  );
}

export function TrueTab() {
  return (
    <ScrollContent
      label="true"
      testID="override-inset-true-scrollview"
    />
  );
}

function DefaultTab() {
  return (
    <ScrollContent
      label="(not set, defaults to true)"
      testID="override-inset-default-scrollview"
    />
  );
}

export export function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <TabsContainer
          routeConfigs={[
            {
              name: 'False',
              Component: FalseTab,
              options: {
                title: 'False',
                tabBarItemAccessibilityLabel: 'override-inset-tab-false',
                ios: {
                  overrideScrollViewContentInsetAdjustmentBehavior: false,
                  icon: { type: 'sfSymbol', name: 'xmark.circle' },
                },
              },
            },
            {
              name: 'True',
              Component: TrueTab,
              options: {
                title: 'True',
                tabBarItemTestID: 'override-inset-tab-true',
                ios: {
                  overrideScrollViewContentInsetAdjustmentBehavior: true,
                  icon: { type: 'sfSymbol', name: 'checkmark.circle' },
                },
              },
            },
            {
              name: 'Default',
              Component: DefaultTab,
              options: {
                title: 'Default',
                tabBarItemTestID: 'override-inset-tab-default',
                ios: { icon: { type: 'sfSymbol', name: 'circle.dashed' } },
              },
            },
          ]}
        />
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  headerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  item: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
  },
});

export default createScenario(App, scenarioDescription);

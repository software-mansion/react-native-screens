import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { TabsContainer } from '@apps/shared/gamma/containers/tabs';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';

const ITEM_COUNT = 30;

function ScrollContent({
  label,
  testID,
}: {
  label: string;
  testID: string;
}) {
  return (
    <ScrollView style={styles.scrollView} testID={`${testID}-scrollview`}>
      <View style={styles.header}>
        <Text style={styles.headerText} testID={`${testID}-header`}>
          overrideScrollViewContentInsetAdjustmentBehavior: {label}
        </Text>
      </View>
      {Array.from({ length: ITEM_COUNT }, (_, i) => (
        <View key={i} style={styles.item} testID={`${testID}-item-${i + 1}`}>
          <Text style={styles.itemText}>Item {i + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function FalseTab() {
  return <ScrollContent label="false" testID="override-inset-false" />;
}

function TrueTab() {
  return <ScrollContent label="true" testID="override-inset-true" />;
}

function DefaultTab() {
  return (
    <ScrollContent
      label="(not set, defaults to true)"
      testID="override-inset-default"
    />
  );
}

function TestTabsOverrideScrollViewContentInset() {
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
                tabBarItemAccessibilityLabel: 'override-inset-tab-true',
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
                tabBarItemAccessibilityLabel: 'override-inset-tab-default',
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

export default createScenario(TestTabsOverrideScrollViewContentInset, scenarioDescription);

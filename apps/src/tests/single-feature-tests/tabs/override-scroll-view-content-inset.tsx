import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import { BottomTabsContainer } from '../../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import type { Scenario } from '../../shared/helpers';

const SCENARIO: Scenario = {
  name: 'Override ScrollView Content Inset',
  key: 'override-scroll-view-content-inset',
  details:
    'Tests overrideScrollViewContentInsetAdjustmentBehavior with different static values per tab. ' +
    'False: content scrolls behind bars. True/Default: content is inset from bars.',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

const ITEM_COUNT = 30;

function ScrollContent({ label }: { label: string }) {
  return (
    <ScrollView style={styles.scrollView}>
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

function FalseTab() {
  return <ScrollContent label="false" />;
}

function TrueTab() {
  return <ScrollContent label="true" />;
}

function DefaultTab() {
  return <ScrollContent label="(not set, defaults to true)" />;
}

function App() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <BottomTabsContainer
          tabConfigs={[
            {
              component: FalseTab,
              tabScreenProps: {
                tabKey: 'False',
                title: 'False',
                ios: {
                  overrideScrollViewContentInsetAdjustmentBehavior: false,
                  icon: { type: 'sfSymbol', name: 'xmark.circle' },
                },
              },
            },
            {
              component: TrueTab,
              tabScreenProps: {
                tabKey: 'True',
                title: 'True',
                ios: {
                  overrideScrollViewContentInsetAdjustmentBehavior: true,
                  icon: { type: 'sfSymbol', name: 'checkmark.circle' },
                },
              },
            },
            {
              component: DefaultTab,
              tabScreenProps: {
                tabKey: 'Default',
                title: 'Default',
                ios: {
                  icon: { type: 'sfSymbol', name: 'circle.dashed' },
                },
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

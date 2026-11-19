import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  TabsContainer,
} from '@apps/shared/containers/tabs';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';

// The column does not set `disableStackIntegration`. The stack is rendered
// inside Tabs, so it is not integrated with the column.
function TestSplitStackV5InTabs() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <TabsContainer
          routeConfigs={[
            {
              name: 'Stack',
              element: <NestedStack />,
              options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Stack' },
            },
            {
              name: 'Plain',
              element: <PlainTab />,
              options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Plain' },
            },
          ]}
        />
      </Split.Column>
      <Split.Column>
        <View style={styles.plainColumn}>
          <Text style={styles.title}>Plain column</Text>
        </View>
      </Split.Column>
    </Split.Host>
  );
}

function NestedStack() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Nested root',
          element: <Screen title="Nested root" next="Nested pushed" />,
          options: { headerConfig: { title: 'Nested root' } },
        },
        {
          name: 'Nested pushed',
          element: <Screen title="Nested pushed" />,
          options: { headerConfig: { title: 'Nested pushed' } },
        },
      ]}
    />
  );
}

function Screen({ title, next }: { title: string; next?: string }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <StackNavigationButtons
        routeNames={next != null ? [next] : []}
        isPopEnabled={next == null}
      />
    </View>
  );
}

function PlainTab() {
  return (
    <View style={styles.plainTab}>
      <Text style={styles.title}>Plain tab</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.YellowLight100,
  },
  plainTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BlueLight100,
  },
  plainColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.GreenLight100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default createScenario(TestSplitStackV5InTabs, scenarioDescription);

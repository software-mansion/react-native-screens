import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';

function TestSplitStackIntegrationDisabled() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column disableStackIntegration>
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
      </Split.Column>
      <Split.Column>
        <View style={styles.secondary}>
          <Text style={styles.title}>Plain column</Text>
        </View>
      </Split.Column>
    </Split.Host>
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.YellowLight100,
  },
  secondary: {
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

export default createScenario(
  TestSplitStackIntegrationDisabled,
  scenarioDescription,
);

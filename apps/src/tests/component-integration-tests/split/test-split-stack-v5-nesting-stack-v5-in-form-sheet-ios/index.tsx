import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet, Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';

// The column does not set `disableStackIntegration`. The stack is rendered
// inside a sheet, so it is not integrated with the column.
function TestSplitStackV5InFormSheet() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <View style={styles.primaryColumn}>
          <Text style={styles.title}>Primary column</Text>
        </View>
      </Split.Column>
      <Split.Column>
        <ColumnWithSheet />
      </Split.Column>
    </Split.Host>
  );
}

function ColumnWithSheet() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <View style={styles.plainColumn}>
      <Text style={styles.title}>Plain column</Text>
      <Button title="Open sheet" onPress={() => setIsOpen(true)} />
      <FormSheet
        isOpen={isOpen}
        onNativeDismiss={() => setIsOpen(false)}
        detents={[0.6, 1.0]}>
        <View style={styles.fill}>
          <NestedStack />
        </View>
      </FormSheet>
    </View>
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

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.YellowLight100,
  },
  primaryColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BlueLight100,
  },
  plainColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.GreenLight100,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default createScenario(TestSplitStackV5InFormSheet, scenarioDescription);

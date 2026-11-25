import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';

function TestSplitStackPressables() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <ColumnStack name="Primary" />
      </Split.Column>
      <Split.Column>
        <ColumnStack name="Supplementary" />
      </Split.Column>
      <Split.Column>
        <ColumnStack name="Secondary" />
      </Split.Column>
    </Split.Host>
  );
}

// A stack that navigates the column, with two screens.
function ColumnStack({ name }: { name: string }) {
  const root = `${name} root`;
  const pushed = `${name} pushed`;

  return (
    <StackContainer
      routeConfigs={[
        {
          name: root,
          element: <Screen title={root} next={pushed} />,
          options: { headerConfig: { title: root } },
        },
        {
          name: pushed,
          element: <Screen title={pushed} />,
          options: { headerConfig: { title: pushed } },
        },
      ]}
    />
  );
}

// A pressable that counts its presses, and a button that pushes the next
// screen or pops this one.
function Screen({ title, next }: { title: string; next?: string }) {
  const [presses, setPresses] = React.useState(0);

  return (
    <View style={styles.container}>
      <PressableWithFeedback
        style={styles.pressable}
        onPress={() => setPresses(value => value + 1)}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.presses}>Presses: {presses}</Text>
      </PressableWithFeedback>
      <StackNavigationButtons
        routeNames={next != null ? [next] : []}
        isPopEnabled={next == null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.White,
  },
  pressable: {
    height: 150,
    width: 240,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  presses: {
    fontSize: 16,
    fontVariant: ['tabular-nums'],
  },
});

export default createScenario(TestSplitStackPressables, scenarioDescription);

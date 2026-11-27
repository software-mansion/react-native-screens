import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Split } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { Colors } from '@apps/shared/styling';

// A `Stack.Host` is integrated with a `Split.Column` only as its direct and
// only child. The primary and the supplementary column break that rule, so
// their stacks are nested in the columns.
function TestSplitStackOnlyChildRule() {
  return (
    <Split.Host preferredDisplayMode="oneBesideSecondary">
      <Split.Column>
        <View style={styles.wrapper}>
          <ColumnStack name="Wrapped" color={Colors.RedLight60} />
        </View>
      </Split.Column>
      <Split.Column>
        <ColumnStack name="Above a footer" color={Colors.YellowLight100} />
        <View style={styles.footer}>
          <Text style={styles.title}>Footer</Text>
        </View>
      </Split.Column>
      <Split.Column>
        <ColumnStack name="Integrated" color={Colors.GreenLight100} />
      </Split.Column>
    </Split.Host>
  );
}

function ColumnStack({ name, color }: { name: string; color: string }) {
  const root = `${name} root`;
  const pushed = `${name} pushed`;

  return (
    <StackContainer
      routeConfigs={[
        {
          name: root,
          element: <Screen title={root} next={pushed} color={color} />,
          options: { headerConfig: { title: root } },
        },
        {
          name: pushed,
          element: <Screen title={pushed} color={color} />,
          options: { headerConfig: { title: pushed } },
        },
      ]}
    />
  );
}

// A pressable that counts its presses, and a button that pushes the next
// screen or pops this one.
function Screen({
  title,
  next,
  color,
}: {
  title: string;
  next?: string;
  color: string;
}) {
  const [presses, setPresses] = React.useState(0);

  return (
    <View style={[styles.screen, { backgroundColor: color }]}>
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
  // Only layout props, so React Native does not create a view for it.
  wrapper: {
    flex: 1,
    marginTop: 40,
    marginLeft: 40,
  },
  footer: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.BlueLight100,
  },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
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

export default createScenario(TestSplitStackOnlyChildRule, scenarioDescription);

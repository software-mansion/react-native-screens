import React, { useState } from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, StyleSheet, Text, View } from 'react-native';
import { FormSheet } from 'react-native-screens/experimental';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';

const scenarioDescription: ScenarioDescription = {
  name: 'FormSheet with Nested Stack v5',
  key: 'test-formsheet-nested-stack-v5',
  details: 'Test nesting Stack v5 inside a FormSheet',
  platforms: ['ios'],
};

export function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FormSheet with nested StackV5</Text>
      <Button title="Open FormSheet" onPress={() => setIsOpen(true)} />
      <FormSheet
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
        detents={[0.6, 1.0]}>
        <View style={styles.sheetContent}>
          <StackSetup />
        </View>
      </FormSheet>
    </View>
  );
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: HomeScreen,
          options: {},
        },
        {
          name: 'A',
          Component: AScreen,
          options: {
            headerConfig: {
              title: 'A',
            },
          },
        },
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="Home" />
      <StackNavigationButtons isPopEnabled={false} routeNames={['A']} />
      <PressableTester />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <RouteInformation routeName="A" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['A']} />
      <PressableTester />
    </CenteredLayoutView>
  );
}

function RouteInformation(props: { routeName: string }) {
  const routeKey = useStackNavigationContext().routeKey;

  return (
    <View>
      <Text style={styles.routeInformation}>Name: {props.routeName}</Text>
      <Text style={styles.routeInformation}>Key: {routeKey}</Text>
    </View>
  );
}

function PressableTester() {
  return (
    <PressableWithFeedback style={styles.pressable}>
      <Text style={styles.text}>Press</Text>
    </PressableWithFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f000',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sheetContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  routeInformation: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pressable: {
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default createScenario(App, scenarioDescription);

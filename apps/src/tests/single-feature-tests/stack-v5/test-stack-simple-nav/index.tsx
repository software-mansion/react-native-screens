import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const scenarioDescription: ScenarioDescription = {
  name: 'Simple navigation scenario',
  key: 'test-stack-simple-nav',
  details: 'Test simple push and pop operations',
  platforms: ['android', 'ios'],
};

export function App() {
  return <StackSetup />;
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
          options: {},
        },
        {
          name: 'B',
          Component: BScreen,
          options: {},
        },
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight40 }}>
      <RouteInformation routeName="Home" />
      <StackNavigationButtons isPopEnabled={false} routeNames={['A', 'B']} />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <RouteInformation routeName="A" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['A', 'B']} />
    </CenteredLayoutView>
  );
}

function BScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <RouteInformation routeName="B" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['A', 'B']} />
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

const styles = StyleSheet.create({
  routeInformation: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default createScenario(App, scenarioDescription);

import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/gamma/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const scenarioDescription: ScenarioDescription = {
  name: 'Animation Android',
  key: 'test-animation-android',
  details: 'High contrast screens to test animations on Android',
  platforms: ['android'],
};

export function App() {
  return <StackSetup />;
}

export function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: HomeScreen,
          options: {},
        },
        {
          name: 'Blue',
          Component: BlueScreen,
          options: {},
        },
        {
          name: 'Red',
          Component: RedScreen,
          options: {},
        },
        {
          name: 'NestedHost',
          Component: NestedHostScreen,
          options: {},
        },
      ]}
    />
  );
}

export function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <StackNavigationButtons
        isPopEnabled={false}
        routeNames={['Blue', 'Red', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

export function BlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Red', 'Blue', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

export function RedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Blue', 'Red', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

export function NestedHostScreen() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'NestedHome',
          Component: NestedHomeScreen,
          options: {},
        },
        {
          name: 'NestedBlue',
          Component: NestedBlueScreen,
          options: {},
        },
        {
          name: 'NestedRed',
          Component: NestedRedScreen,
          options: {},
        },
      ]}
    />
  );
}

export function NestedHomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['NestedBlue', 'NestedRed']}
      />
    </CenteredLayoutView>
  );
}

export function NestedBlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['NestedRed', 'NestedBlue']}
      />
    </CenteredLayoutView>
  );
}

export function NestedRedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['NestedBlue', 'NestedRed']}
      />
    </CenteredLayoutView>
  );
}

export default createScenario(App, scenarioDescription);

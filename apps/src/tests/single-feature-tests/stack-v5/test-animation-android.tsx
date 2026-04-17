import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/gamma/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import Colors from '@apps/shared/styling/Colors';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

export default function App() {
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

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <StackNavigationButtons
        isPopEnabled={false}
        routeNames={['Blue', 'Red', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function BlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Red', 'Blue', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function RedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Blue', 'Red', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function NestedHostScreen() {
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

function NestedHomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['NestedBlue', 'NestedRed']}
      />
    </CenteredLayoutView>
  );
}

function NestedBlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['NestedRed', 'NestedBlue']}
      />
    </CenteredLayoutView>
  );
}

function NestedRedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['NestedBlue', 'NestedRed']}
      />
    </CenteredLayoutView>
  );
}

App.scenarioDescription = {
  name: 'Animation Android',
  key: 'test-animation-android',
  details: 'High contrast screens to test animations on Android',
  platforms: ['android'],
} satisfies ScenarioDescription;

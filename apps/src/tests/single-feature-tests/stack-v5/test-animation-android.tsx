import React from 'react';
import { Scenario } from '../../shared/helpers';
import { StackContainer } from '../../../shared/gamma/containers/stack';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import Colors from '../../../shared/styling/Colors';
import { StackNavigationButtons } from '../../shared/components/stack-v5/StackNavigationButtons';

const SCENARIO: Scenario = {
  name: 'Animation Android',
  key: 'test-animation-android',
  details: 'High contrast screens to test animations on Android',
  platforms: ['android'],
  AppComponent: App,
};

export default SCENARIO;

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
          name: 'Blue',
          Component: BlueScreen,
          options: {},
        },
        {
          name: 'Red',
          Component: RedScreen,
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
        routeNames={['Blue', 'Red']}
      />
    </CenteredLayoutView>
  );
}

function BlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Red', 'Blue']}
      />
    </CenteredLayoutView>
  );
}

function RedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Blue', 'Red']}
      />
    </CenteredLayoutView>
  );
}

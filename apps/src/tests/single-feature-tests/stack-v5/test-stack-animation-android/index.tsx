import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

function TestStackAnimationAndroid() {
  return <StackSetup />;
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          element: <HomeScreen />,
        },
        {
          name: 'Blue',
          element: <BlueScreen />,
        },
        {
          name: 'Red',
          element: <RedScreen />,
        },
        {
          name: 'NestedHost',
          element: <NestedHostScreen />,
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
          element: <NestedHomeScreen />,
        },
        {
          name: 'NestedBlue',
          element: <NestedBlueScreen />,
        },
        {
          name: 'NestedRed',
          element: <NestedRedScreen />,
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

export default createScenario(TestStackAnimationAndroid, scenarioDescription);

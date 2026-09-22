import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

/**
 * Every screen can reach every other one, which is more than the scenario walks through - the
 * spare buttons are there so the screen doubles as a playground for trying transitions by hand.
 */
function TestStackAnimationAndroid() {
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
          // The only route with a non-default animation. A vertical slide moves over a screen
          // that stays put, so the draw order is visible; the horizontal slides carry both
          // screens at once and never overlap. The slides inside the host are also visibly
          // not the host's own transition.
          name: 'NestedHost',
          element: <NestedHostScreen />,
          options: { animation: 'slideFromBottom' },
        },
      ]}
    />
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <StackRouteInformation routeName="Home" />
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
      <StackRouteInformation routeName="Blue" />
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Red', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function RedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackRouteInformation routeName="Red" />
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Blue', 'NestedHost']}
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
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <StackRouteInformation routeName="NestedHome" />
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
      <StackRouteInformation routeName="NestedBlue" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['NestedRed']} />
    </CenteredLayoutView>
  );
}

function NestedRedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackRouteInformation routeName="NestedRed" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['NestedBlue']} />
    </CenteredLayoutView>
  );
}

export default createScenario(TestStackAnimationAndroid, scenarioDescription);

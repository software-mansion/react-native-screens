import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

function TestStackSimpleNav() {
  return <StackSetup />;
}

function StackSetup() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          Component: HomeScreen,
          // Rendering a header (via headerConfig) makes the native back
          // button appear on non-root screens, including on Android. The
          // root screen (Home) always hides the back button.
          options: {
            headerConfig: {
              title: 'Home',
            },
          },
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
        {
          name: 'B',
          Component: BScreen,
          options: {
            headerConfig: {
              title: 'B',
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
      <StackRouteInformation routeName="Home" />
      <StackNavigationButtons isPopEnabled={false} routeNames={['A', 'B']} />
    </CenteredLayoutView>
  );
}

function AScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight40 }}>
      <StackRouteInformation routeName="A" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['A', 'B']} />
    </CenteredLayoutView>
  );
}

function BScreen() {
  return (
    <CenteredLayoutView
      testID="screenB-layout-view"
      style={{ backgroundColor: Colors.GreenLight100 }}>
      <StackRouteInformation routeName="B" />
      <StackNavigationButtons isPopEnabled={true} routeNames={['A', 'B']} />
    </CenteredLayoutView>
  );
}

export default createScenario(TestStackSimpleNav, scenarioDescription);

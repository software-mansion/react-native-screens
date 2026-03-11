import React from 'react';
import { Scenario } from '../../shared/helpers';
import { StackContainer } from '../../../shared/gamma/containers/stack';
import { ScrollView } from 'react-native';
import LongText from '../../../../src/shared/LongText';
import { StackNavigationButtons } from '../../shared/components/stack-v5/StackNavigationButtons';
import Colors from '../../../../src/shared/styling/Colors';

const SCENARIO: Scenario = {
  name: 'Stack Header Modes',
  key: 'test-stack-header-modes',
  details: '[WIP] Tests different header modes.',
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
          Component: () => Screen(true),
          options: {},
        },
        {
          name: 'A',
          Component: () => Screen(false),
          options: {},
        },
      ]}
    />
  );
}

function Screen(isHome: boolean) {
  return (
    <ScrollView
      nestedScrollEnabled={true}
      style={{ backgroundColor: Colors.cardBackground }}>
      <StackNavigationButtons isPopEnabled={!isHome} routeNames={['A']} />
      <LongText size="xl" />
    </ScrollView>
  );
}

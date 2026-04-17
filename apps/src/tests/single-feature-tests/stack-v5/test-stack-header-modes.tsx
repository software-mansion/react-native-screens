import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { StackContainer } from '../../../shared/gamma/containers/stack';
import { ScrollView, Text, View } from 'react-native';
import LongText from '../../../../src/shared/LongText';
import { StackNavigationButtons } from '../../shared/components/stack-v5/StackNavigationButtons';
import { Colors } from '@apps/shared/styling';
import PressableWithFeedback from '../../../../src/shared/PressableWithFeedback';

const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Modes',
  key: 'test-stack-header-modes',
  details: '[WIP] Tests different header modes.',
  platforms: ['android'],
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
      <LongText size="xs" />
      <View style={{ paddingVertical: 10, gap: 10 }}>
        <StackNavigationButtons isPopEnabled={!isHome} routeNames={['A']} />
        <PressableWithFeedback
          style={{
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Pressable</Text>
        </PressableWithFeedback>
      </View>
      <LongText size="xl" />
    </ScrollView>
  );
}

export default createScenario(App, scenarioDescription);

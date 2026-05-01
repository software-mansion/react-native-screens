import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { ScrollViewMarker } from 'react-native-screens/experimental';
import { StackContainer } from '@apps/shared/gamma/containers/stack';
import { Rectangle } from '@apps/shared/Rectangle';
import { Colors } from '@apps/shared/styling';
import { generateNextColor } from '@apps/shared/utils/color-generator';

const scenarioDescription: ScenarioDescription = {
  name: 'Basic functionality',
  key: 'test-svm-configures-scroll-view',
  details:
    'Allows to test the basic functionality of ScrollViewMarker component. ' +
    'It utilizes the StackContainer, to allow for observation of edge effects ' +
    'applied to the container edges. On Android this test serves only as a setup ' +
    'for native debugging.',
  platforms: ['ios', 'android'],
};

export function App() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Content',
          Component: ContentScreen,
          options: {},
        },
      ]}
    />
  );
}

export function ContentScreen() {
  return (
    <View
      style={[
        styles.container,
        styles.fillParent,
        { backgroundColor: Colors.White },
      ]}>
      <Text>Interrupt "first descendant chain" heuristic</Text>
      <ScrollViewMarker
        style={[styles.fillParent]}
        scrollEdgeEffects={{ top: 'hard' }}>
        <ScrollView
          style={[styles.fillParent]}
          contentInsetAdjustmentBehavior="automatic">
          {Array.from({ length: 12 }).map((_, index) => {
            return (
              <Rectangle
                key={index}
                color={generateNextColor()}
                width={'100%'}
                height={96}
              />
            );
          })}
        </ScrollView>
      </ScrollViewMarker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fillParent: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default createScenario(App, scenarioDescription);

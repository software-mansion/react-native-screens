import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

const ANIMATION_OPTIONS = [
  'slideFromRight',
  'slideFromLeft',
  'slideFromBottom',
  'slideFromTop',
] as const satisfies readonly StackScreenAnimation[];
type AnimationOption = (typeof ANIMATION_OPTIONS)[number];

// An unset `animation` resolves to `default` natively, which is not one of the picker's
// values, so every route starts with `slideFromRight` set explicitly.
const DEFAULT_ANIMATION: AnimationOption = 'slideFromRight';
const DEFAULT_OPTIONS = { animation: DEFAULT_ANIMATION };

// The picker only offers the slide subset of the library's union.
function asOption(
  animation: StackScreenAnimation | undefined,
): AnimationOption {
  return (
    ANIMATION_OPTIONS.find(option => option === animation) ?? DEFAULT_ANIMATION
  );
}

function TestStackAnimationUpdateAndroid() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Home',
          element: <HomeScreen />,
          options: DEFAULT_OPTIONS,
        },
        {
          name: 'Blue',
          element: <BlueScreen />,
          options: DEFAULT_OPTIONS,
        },
        {
          name: 'Red',
          element: <RedScreen />,
          options: DEFAULT_OPTIONS,
        },
      ]}
    />
  );
}

/**
 * "this screen" updates the current route's options, so it changes the animation of a screen
 * that is already on the stack. It drives that screen's own pop, both with the button and with
 * the predictive back gesture.
 */
function AnimationControls() {
  const { routeKey, routeOptions, setRouteOptions } =
    useStackNavigationContext();

  return (
    <View style={styles.controls}>
      <SettingsPicker<AnimationOption>
        label="this screen"
        value={asOption(routeOptions.animation)}
        onValueChange={animation => setRouteOptions(routeKey, { animation })}
        items={[...ANIMATION_OPTIONS]}
      />
    </View>
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <StackRouteInformation routeName="Home" />
      <AnimationControls />
      <StackNavigationButtons isPopEnabled={false} routeNames={['Blue']} />
    </CenteredLayoutView>
  );
}

function BlueScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.BlueLight100 }}>
      <StackRouteInformation routeName="Blue" />
      <AnimationControls />
      <StackNavigationButtons isPopEnabled={true} routeNames={['Red']} />
    </CenteredLayoutView>
  );
}

function RedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <StackRouteInformation routeName="Red" />
      <AnimationControls />
      <StackNavigationButtons isPopEnabled={true} routeNames={[]} />
    </CenteredLayoutView>
  );
}

const styles = StyleSheet.create({
  controls: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
});

export default createScenario(
  TestStackAnimationUpdateAndroid,
  scenarioDescription,
);

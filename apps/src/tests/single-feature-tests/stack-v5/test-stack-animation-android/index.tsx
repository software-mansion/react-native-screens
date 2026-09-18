import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainerWithDynamicRouteConfigs,
  useStackNavigationContext,
  useStackRouteConfigContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { SettingsPicker } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import { StackNavigationButtons } from '@apps/tests/shared/components/stack-v5/StackNavigationButtons';

const ANIMATION_OPTIONS = [
  'slideFromRight',
  'slideFromLeft',
  'slideFromBottom',
  'slideFromTop',
  'none',
] as const satisfies readonly StackScreenAnimation[];
type AnimationOption = (typeof ANIMATION_OPTIONS)[number];

// An unset `animation` resolves to `default` natively; this test is about the slides, so every
// route starts with `slideFromRight` set explicitly.
const DEFAULT_ANIMATION: AnimationOption = 'slideFromRight';
const DEFAULT_OPTIONS = { animation: DEFAULT_ANIMATION };

// The pickers only offer the slide subset of the library's union.
function asOption(
  animation: StackScreenAnimation | undefined,
): AnimationOption {
  return (
    ANIMATION_OPTIONS.find(option => option === animation) ?? DEFAULT_ANIMATION
  );
}

function TestStackAnimationAndroid() {
  return <StackSetup />;
}

function StackSetup() {
  return (
    <StackContainerWithDynamicRouteConfigs
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
        {
          name: 'NestedHost',
          element: <NestedHostScreen />,
          options: DEFAULT_OPTIONS,
        },
      ]}
    />
  );
}

/**
 * "next push" is written into every route config of the enclosing container, so it applies
 * to screens pushed from now on. "this screen" updates the current route's options, which
 * drives its own pop (button and predictive back gesture).
 */
function AnimationControls() {
  const { routeKey, routeOptions, setRouteOptions } =
    useStackNavigationContext();
  const { routeConfigs, updateRouteConfigWithOptions } =
    useStackRouteConfigContext();

  const nextPushAnimation = asOption(routeConfigs[0]?.options?.animation);
  const ownAnimation = asOption(routeOptions.animation);

  return (
    <View style={styles.controls}>
      <SettingsPicker<AnimationOption>
        label="next push"
        value={nextPushAnimation}
        onValueChange={animation =>
          routeConfigs.forEach(config =>
            updateRouteConfigWithOptions(config.name, { animation }),
          )
        }
        items={[...ANIMATION_OPTIONS]}
      />
      <SettingsPicker<AnimationOption>
        label="this screen"
        value={ownAnimation}
        onValueChange={animation => setRouteOptions(routeKey, { animation })}
        items={[...ANIMATION_OPTIONS]}
      />
    </View>
  );
}

function HomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.YellowLight100 }}>
      <AnimationControls />
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
      <AnimationControls />
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
      <AnimationControls />
      <StackNavigationButtons
        isPopEnabled={true}
        routeNames={['Blue', 'NestedHost']}
      />
    </CenteredLayoutView>
  );
}

function NestedHostScreen() {
  return (
    <StackContainerWithDynamicRouteConfigs
      routeConfigs={[
        {
          name: 'NestedHome',
          element: <NestedHomeScreen />,
          options: DEFAULT_OPTIONS,
        },
        {
          name: 'NestedBlue',
          element: <NestedBlueScreen />,
          options: DEFAULT_OPTIONS,
        },
        {
          name: 'NestedRed',
          element: <NestedRedScreen />,
          options: DEFAULT_OPTIONS,
        },
      ]}
    />
  );
}

function NestedHomeScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.GreenLight100 }}>
      <AnimationControls />
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
      <AnimationControls />
      <StackNavigationButtons isPopEnabled={true} routeNames={['NestedRed']} />
    </CenteredLayoutView>
  );
}

function NestedRedScreen() {
  return (
    <CenteredLayoutView style={{ backgroundColor: Colors.RedLight100 }}>
      <AnimationControls />
      <StackNavigationButtons isPopEnabled={true} routeNames={['NestedBlue']} />
    </CenteredLayoutView>
  );
}

const styles = StyleSheet.create({
  controls: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
});

export default createScenario(TestStackAnimationAndroid, scenarioDescription);

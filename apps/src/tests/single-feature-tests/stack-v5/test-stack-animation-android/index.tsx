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

const DEFAULT_ANIMATION: AnimationOption = 'slideFromRight';

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

  const nextPushAnimation =
    routeConfigs[0]?.options?.animation ?? DEFAULT_ANIMATION;
  const ownAnimation = routeOptions.animation ?? DEFAULT_ANIMATION;

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

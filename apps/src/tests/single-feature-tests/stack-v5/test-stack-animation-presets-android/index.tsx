import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type {
  StackHostDirection,
  StackScreenAnimation,
} from 'react-native-screens';
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
  'default',
  'slideFromRight',
  'slideFromLeft',
  'slideFromBottom',
  'slideFromTop',
  'fade',
  'fadeFromBottom',
  'fadeFromTop',
  'iosFromRight',
  'iosFromLeft',
  'none',
] as const satisfies readonly StackScreenAnimation[];
type AnimationOption = (typeof ANIMATION_OPTIONS)[number];

// An unset `animation` resolves to `default` natively; the pickers show it as such.
const DEFAULT_ANIMATION: AnimationOption = 'default';

const DIRECTION_OPTIONS = [
  'ltr',
  'rtl',
  'inherit',
] as const satisfies readonly StackHostDirection[];
type DirectionOption = (typeof DIRECTION_OPTIONS)[number];

const DirectionContext = React.createContext<{
  direction: DirectionOption;
  setDirection: (direction: DirectionOption) => void;
}>({ direction: 'ltr', setDirection: () => {} });

function TestStackAnimationPresetsAndroid() {
  const [direction, setDirection] = React.useState<DirectionOption>('ltr');
  const contextValue = React.useMemo(
    () => ({ direction, setDirection }),
    [direction],
  );

  return (
    <DirectionContext.Provider value={contextValue}>
      <StackContainerWithDynamicRouteConfigs
        direction={direction}
        routeConfigs={[
          {
            name: 'Home',
            element: (
              <PresetScreen
                name="Home"
                color={Colors.YellowLight100}
                isPopEnabled={false}
                routeNames={['Blue', 'Red']}
              />
            ),
          },
          {
            name: 'Blue',
            element: (
              <PresetScreen
                name="Blue"
                color={Colors.BlueLight100}
                isPopEnabled={true}
                routeNames={['Red']}
              />
            ),
          },
          {
            name: 'Red',
            element: (
              <PresetScreen
                name="Red"
                color={Colors.RedLight100}
                isPopEnabled={true}
                routeNames={['Blue']}
              />
            ),
          },
        ]}
      />
    </DirectionContext.Provider>
  );
}

/**
 * "next push" is written into every route config, so it applies to screens pushed from now
 * on. "this screen" updates the current route's options, which drives its own pop (button and
 * predictive back gesture). "direction" is the host's layout direction.
 */
function AnimationControls() {
  const { routeKey, routeOptions, setRouteOptions } =
    useStackNavigationContext();
  const { routeConfigs, updateRouteConfigWithOptions } =
    useStackRouteConfigContext();
  const { direction, setDirection } = React.useContext(DirectionContext);

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
      <SettingsPicker<DirectionOption>
        label="direction"
        value={direction}
        onValueChange={setDirection}
        items={[...DIRECTION_OPTIONS]}
      />
    </View>
  );
}

/**
 * The frame at the screen edge makes travel distances and scale changes visible; the bordered
 * card makes fades and the dim scrim visible against the pastel background.
 */
function PresetScreen({
  name,
  color,
  isPopEnabled,
  routeNames,
}: {
  name: string;
  color: string;
  isPopEnabled: boolean;
  routeNames: string[];
}) {
  return (
    <CenteredLayoutView style={{ backgroundColor: color }}>
      <View pointerEvents="none" style={styles.frame} />
      <View style={styles.card}>
        <Text style={styles.title}>{name}</Text>
        <AnimationControls />
        <StackNavigationButtons
          isPopEnabled={isPopEnabled}
          routeNames={routeNames}
        />
      </View>
    </CenteredLayoutView>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'absolute',
    top: 12,
    bottom: 12,
    left: 12,
    right: 12,
    borderWidth: 4,
    borderColor: Colors.NavyDark100,
  },
  card: {
    alignSelf: 'stretch',
    marginHorizontal: 32,
    padding: 16,
    borderWidth: 4,
    borderRadius: 16,
    borderColor: Colors.NavyDark100,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.NavyDark100,
    textAlign: 'center',
    marginBottom: 12,
  },
  controls: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
});

export default createScenario(
  TestStackAnimationPresetsAndroid,
  scenarioDescription,
);

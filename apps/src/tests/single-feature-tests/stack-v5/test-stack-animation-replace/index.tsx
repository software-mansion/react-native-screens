import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import type {
  StackScreenAnimation,
  StackScreenReplaceAnimation,
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
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

const SLOW_DURATION_MS = 2000;
// UIKit ignores taps while it pushes a screen, so the replace during the slow
// push is started by a timer.
const REPLACE_DURING_PUSH_DELAY_MS = 1000;

// Every route carries a different preset, so whose `animation` a replace plays is visible.
const ROUTES = [
  { name: 'Home', animation: undefined, color: Colors.YellowLight100 },
  { name: 'Default', animation: undefined, color: Colors.NavyLight40 },
  { name: 'Right', animation: 'slideFromRight', color: Colors.BlueLight100 },
  { name: 'Bottom', animation: 'slideFromBottom', color: Colors.GreenLight100 },
  { name: 'Fade', animation: 'fade', color: Colors.RedLight100 },
  { name: 'Ios', animation: 'iosFromRight', color: Colors.PurpleLight100 },
  {
    name: 'Right 2000 ms',
    animation: {
      type: 'preset',
      name: 'slideFromRight',
      duration: SLOW_DURATION_MS,
    },
    color: Colors.BlueLight100,
  },
] as const satisfies readonly {
  name: string;
  animation: StackScreenAnimation | undefined;
  color: string;
}[];
type Route = (typeof ROUTES)[number];
type RouteName = Route['name'];

const REPLACE_ANIMATION_OPTIONS = [
  'pop',
  'push',
] as const satisfies readonly StackScreenReplaceAnimation[];

const PUSHABLE_ROUTE_NAMES = ROUTES.map(route => route.name).filter(
  (name): name is Exclude<RouteName, 'Home' | 'Right 2000 ms'> =>
    name !== 'Home' && name !== 'Right 2000 ms',
);

// A replace with `Default` shows nothing new: with `pop` the outgoing screen's
// pop plays, with `push` the same push as "Push Default".
const REPLACEMENT_ROUTE_NAMES = [
  'Right',
  'Bottom',
  'Fade',
  'Ios',
] as const satisfies readonly RouteName[];

const ROUTE_CONFIGS = ROUTES.map(route => ({
  name: route.name,
  element: <Screen route={route} />,
  options: {
    animation: route.animation,
    headerConfig: {
      title: `${route.name} · ${
        typeof route.animation === 'object'
          ? route.animation.name
          : route.animation ?? 'default'
      }`,
    },
  },
}));

// Set by "Push Right 2000 ms + replace in 1 s", read by the pushed screen.
const ReplaceDuringPushContext = React.createContext<{ current: boolean }>({
  current: false,
});

function TestStackAnimationReplace() {
  const replacesDuringPush = React.useRef(false);

  return (
    <ReplaceDuringPushContext.Provider value={replacesDuringPush}>
      <StackContainerWithDynamicRouteConfigs routeConfigs={ROUTE_CONFIGS} />
    </ReplaceDuringPushContext.Provider>
  );
}

function Screen({ route }: { route: Route }) {
  return (
    <CenteredLayoutView style={{ backgroundColor: route.color }}>
      <StackRouteInformation routeName={route.name} />
      <ReplaceAnimationPicker />
      <OperationButtons isRoot={route.name === 'Home'} />
    </CenteredLayoutView>
  );
}

/**
 * `replaceAnimation` is read on the incoming screen of a replace, so the picker writes the value
 * into every route config: it applies to whichever route is pushed by the next replace.
 */
function ReplaceAnimationPicker() {
  const { routeConfigs, updateRouteConfigWithOptions } =
    useStackRouteConfigContext();

  return (
    <View style={styles.picker}>
      <SettingsPicker<StackScreenReplaceAnimation>
        label="replaceAnimation"
        value={routeConfigs[0]?.options?.replaceAnimation ?? 'pop'}
        onValueChange={replaceAnimation =>
          routeConfigs.forEach(config =>
            updateRouteConfigWithOptions(config.name, { replaceAnimation }),
          )
        }
        items={[...REPLACE_ANIMATION_OPTIONS]}
      />
    </View>
  );
}

function OperationButtons({ isRoot }: { isRoot: boolean }) {
  const { routeKey, push, pop, batch } = useStackNavigationContext();
  const replacesDuringPush = React.useContext(ReplaceDuringPushContext);

  const replaceWith = (routeName: RouteName) =>
    batch([
      { type: 'pop', routeKey },
      { type: 'push', routeName },
    ]);
  const replaceWithRef = React.useRef(replaceWith);
  replaceWithRef.current = replaceWith;

  React.useEffect(() => {
    if (!replacesDuringPush.current) {
      return;
    }
    replacesDuringPush.current = false;
    const timeout = setTimeout(
      () => replaceWithRef.current('Bottom'),
      REPLACE_DURING_PUSH_DELAY_MS,
    );
    return () => clearTimeout(timeout);
  }, [replacesDuringPush]);

  return (
    <View style={styles.buttons}>
      {PUSHABLE_ROUTE_NAMES.map(routeName => (
        <Button
          key={routeName}
          title={`Push ${routeName}`}
          onPress={() => push(routeName)}
        />
      ))}
      <Button
        title="Push Right 2000 ms + replace in 1 s"
        onPress={() => {
          replacesDuringPush.current = true;
          push('Right 2000 ms');
        }}
      />
      <Button title="Pop" disabled={isRoot} onPress={() => pop(routeKey)} />
      {REPLACEMENT_ROUTE_NAMES.map(routeName => (
        <Button
          key={routeName}
          title={`Replace with ${routeName}`}
          disabled={isRoot}
          onPress={() => replaceWith(routeName)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    alignSelf: 'stretch',
    marginBottom: 12,
  },
  buttons: {
    alignSelf: 'stretch',
    gap: 4,
  },
});

export default createScenario(TestStackAnimationReplace, scenarioDescription);

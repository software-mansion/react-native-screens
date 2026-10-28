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

// Every route carries a different preset, so whose `animation` a replace plays is visible.
const ROUTES = [
  { name: 'Home', animation: undefined, color: Colors.YellowLight100 },
  { name: 'Right', animation: 'slideFromRight', color: Colors.BlueLight100 },
  { name: 'Bottom', animation: 'slideFromBottom', color: Colors.GreenLight100 },
  { name: 'Fade', animation: 'fade', color: Colors.RedLight100 },
  { name: 'Ios', animation: 'iosFromRight', color: Colors.PurpleLight100 },
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
  (name): name is Exclude<RouteName, 'Home'> => name !== 'Home',
);

const ROUTE_CONFIGS = ROUTES.map(route => ({
  name: route.name,
  element: <Screen route={route} />,
  options: {
    animation: route.animation,
    headerConfig: {
      title: `${route.name} · ${route.animation ?? 'default'}`,
    },
  },
}));

function TestStackAnimationReplaceAndroid() {
  return <StackContainerWithDynamicRouteConfigs routeConfigs={ROUTE_CONFIGS} />;
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

  const replaceWith = (routeName: RouteName) =>
    batch([
      { type: 'pop', routeKey },
      { type: 'push', routeName },
    ]);

  return (
    <View style={styles.buttons}>
      {PUSHABLE_ROUTE_NAMES.map(routeName => (
        <Button
          key={routeName}
          title={`Push ${routeName}`}
          onPress={() => push(routeName)}
        />
      ))}
      <Button title="Pop" disabled={isRoot} onPress={() => pop(routeKey)} />
      {PUSHABLE_ROUTE_NAMES.map(routeName => (
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

export default createScenario(
  TestStackAnimationReplaceAndroid,
  scenarioDescription,
);

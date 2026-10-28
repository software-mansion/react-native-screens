import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import type { StackScreenAnimation } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { Colors } from '@apps/shared/styling';
import { StackRouteInformation } from '@apps/tests/shared/components/stack-v5/StackRouteInformation';

const ROUTES = [
  { name: 'Home', animation: undefined, color: Colors.YellowLight100 },
  { name: 'Right', animation: 'slideFromRight', color: Colors.BlueLight100 },
  { name: 'Left', animation: 'slideFromLeft', color: Colors.RedLight100 },
  { name: 'Bottom', animation: 'slideFromBottom', color: Colors.GreenLight100 },
  { name: 'Top', animation: 'slideFromTop', color: Colors.PurpleLight100 },
] as const satisfies readonly {
  name: string;
  animation: StackScreenAnimation | undefined;
  color: string;
}[];
type RouteName = (typeof ROUTES)[number]['name'];

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

function TestStackAnimationOperationsAndroid() {
  return (
    <RouteKeysLedger>
      <StackContainer routeConfigs={ROUTE_CONFIGS} />
    </RouteKeysLedger>
  );
}

/**
 * The reference navigator exposes only the current screen's key, while a multi-pop needs the
 * keys of the screens below it. Screens register on mount, in stack order. A popped screen
 * leaves the list only once its dismissal completes, so the tail may still be a screen that is
 * being popped natively - operations start from the pressing screen's own entry instead.
 */
type RouteKeysLedgerPayload = {
  keys: string[];
  register: (routeKey: string) => void;
  unregister: (routeKey: string) => void;
};

const RouteKeysLedgerContext =
  React.createContext<RouteKeysLedgerPayload | null>(null);

function RouteKeysLedger({ children }: { children: React.ReactNode }) {
  const [keys, setKeys] = React.useState<string[]>([]);
  const register = React.useCallback(
    (routeKey: string) => setKeys(prev => [...prev, routeKey]),
    [],
  );
  const unregister = React.useCallback(
    (routeKey: string) => setKeys(prev => prev.filter(key => key !== routeKey)),
    [],
  );
  const value = React.useMemo<RouteKeysLedgerPayload>(
    () => ({ keys, register, unregister }),
    [keys, register, unregister],
  );
  return (
    <RouteKeysLedgerContext.Provider value={value}>
      {children}
    </RouteKeysLedgerContext.Provider>
  );
}

function useRouteKeysLedger() {
  const ledger = React.useContext(RouteKeysLedgerContext);
  if (!ledger) {
    throw new Error('useRouteKeysLedger must be used within RouteKeysLedger');
  }
  return ledger;
}

function Screen({ route }: { route: (typeof ROUTES)[number] }) {
  const { routeKey } = useStackNavigationContext();
  const { register, unregister } = useRouteKeysLedger();

  React.useEffect(() => {
    register(routeKey);
    return () => unregister(routeKey);
  }, [routeKey, register, unregister]);

  return (
    <CenteredLayoutView style={{ backgroundColor: route.color }}>
      <StackRouteInformation routeName={route.name} />
      <OperationButtons />
    </CenteredLayoutView>
  );
}

function OperationButtons() {
  const { routeKey, push, batch } = useStackNavigationContext();
  const { keys } = useRouteKeysLedger();
  const depth = keys.indexOf(routeKey) + 1;

  const pushMultiple = (routeNames: RouteName[]) =>
    batch(routeNames.map(routeName => ({ type: 'push', routeName })));

  // Top first, so that every pop in the batch targets the current top.
  const popActions = (count: number) =>
    keys
      .slice(depth - count, depth)
      .reverse()
      .map(key => ({ type: 'pop' as const, routeKey: key }));

  const popMultiple = (count: number) => batch(popActions(count));

  const replaceMultiple = (count: number, routeNames: RouteName[]) =>
    batch([
      ...popActions(count),
      ...routeNames.map(routeName => ({ type: 'push' as const, routeName })),
    ]);

  return (
    <View style={styles.buttons}>
      <Button title="Push Right" onPress={() => push('Right')} />
      <Button title="Push Left" onPress={() => push('Left')} />
      <Button title="Push Bottom" onPress={() => push('Bottom')} />
      <Button title="Push Top" onPress={() => push('Top')} />
      <Button
        title="Push Left + Top"
        onPress={() => pushMultiple(['Left', 'Top'])}
      />
      <Button
        title="Push Right + Bottom + Left"
        onPress={() => pushMultiple(['Right', 'Bottom', 'Left'])}
      />
      <Button
        title="Pop"
        disabled={depth <= 1}
        onPress={() => popMultiple(1)}
      />
      <Button
        title="Pop 2"
        disabled={depth <= 2}
        onPress={() => popMultiple(2)}
      />
      <Button
        title="Pop 3"
        disabled={depth <= 3}
        onPress={() => popMultiple(3)}
      />
      <Button
        title="Replace with Right"
        disabled={depth <= 1}
        onPress={() => replaceMultiple(1, ['Right'])}
      />
      <Button
        title="Replace with Bottom"
        disabled={depth <= 1}
        onPress={() => replaceMultiple(1, ['Bottom'])}
      />
      <Button
        title="Replace 2 with Left + Top"
        disabled={depth <= 2}
        onPress={() => replaceMultiple(2, ['Left', 'Top'])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttons: {
    alignSelf: 'stretch',
    gap: 4,
  },
});

export default createScenario(
  TestStackAnimationOperationsAndroid,
  scenarioDescription,
);

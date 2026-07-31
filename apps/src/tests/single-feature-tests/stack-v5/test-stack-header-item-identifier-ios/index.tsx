import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { SettingsSwitch } from '@apps/shared';
import { Colors } from '@apps/shared/styling';
import type {
  StackHeaderConfigProps,
  StackHeaderInlineCustomItemIOS,
  StackHeaderInlineItemIOS,
  StackHeaderSpacerItemIOS,
} from 'react-native-screens/components/stack/header';
import type { PlatformIconIOS } from 'react-native-screens';

type ItemId = 'alpha' | 'bravo' | 'charlie';

const SYMBOL_CYCLES: Record<ItemId, string[]> = {
  alpha: ['1.circle.fill', '2.circle.fill', '3.circle.fill'],
  bravo: ['fish.fill', 'birthday.cake.fill', 'carrot.fill'],
  charlie: ['carrot.fill', 'fish.fill', 'birthday.cake.fill'],
};

const COLOR_CYCLES: Record<ItemId, string[]> = {
  alpha: [Colors.RedLight100, Colors.YellowLight100, Colors.NavyLight100],
  bravo: [Colors.GreenLight100, Colors.BlueLight100, Colors.PurpleLight100],
  charlie: [Colors.BlueLight100, Colors.PurpleLight100, Colors.GreenLight100],
};

function iconForItem(id: ItemId, screenIndex: number): PlatformIconIOS {
  const cycle = SYMBOL_CYCLES[id];
  return { type: 'sfSymbol', name: cycle[screenIndex % cycle.length]! };
}

function colorForItem(id: ItemId, screenIndex: number): string {
  const cycle = COLOR_CYCLES[id];
  return cycle[screenIndex % cycle.length]!;
}

const ROUTE_NAMES = ['One', 'Two', 'Three'];

const LAYOUTS: Record<string, ItemId[]> = {
  One: ['charlie', 'bravo', 'alpha'],
  Two: ['charlie', 'alpha', 'bravo'],
  Three: ['alpha', 'charlie', 'bravo'],
};

type Toggles = {
  identifiersEnabled: boolean;
  separatorsEnabled: boolean;
  customViewsEnabled: boolean;
  setIdentifiersEnabled: (value: boolean) => void;
  setSeparatorsEnabled: (value: boolean) => void;
  setCustomViewsEnabled: (value: boolean) => void;
};

const ToggleContext = createContext<Toggles>({
  identifiersEnabled: true,
  separatorsEnabled: false,
  customViewsEnabled: false,
  setIdentifiersEnabled: () => {},
  setSeparatorsEnabled: () => {},
  setCustomViewsEnabled: () => {},
});

type HeaderItem = StackHeaderInlineItemIOS | StackHeaderInlineCustomItemIOS;

function makeItem(
  id: ItemId,
  screenIndex: number,
  withIdentifier: boolean,
  withCustomView: boolean,
): HeaderItem {
  const identifierProp = withIdentifier ? { identifier: id } : {};
  if (withCustomView) {
    const color = colorForItem(id, screenIndex);
    return {
      type: 'item',
      id,
      render: () => <View style={[styles.customItem, { backgroundColor: color }]} />,
      ...identifierProp,
    };
  }
  return {
    type: 'item',
    id,
    icon: iconForItem(id, screenIndex),
    ...identifierProp,
  };
}

function buildItems(
  ids: ItemId[],
  screenIndex: number,
  withIdentifier: boolean,
  withSeparators: boolean,
  withCustomView: boolean,
): (HeaderItem | StackHeaderSpacerItemIOS)[] {
  const result: (HeaderItem | StackHeaderSpacerItemIOS)[] = [];
  ids.forEach((id, index) => {
    if (withSeparators && index > 0) {
      result.push({
        id: `sep-${index}`,
        type: 'spacer',
        sizing: 'fixed',
        width: 12,
      });
    }
    result.push(makeItem(id, screenIndex, withIdentifier, withCustomView));
  });
  return result;
}

function makeScreen(routeName: string) {
  return function Screen() {
    const {
      identifiersEnabled,
      separatorsEnabled,
      customViewsEnabled,
      setIdentifiersEnabled,
      setSeparatorsEnabled,
      setCustomViewsEnabled,
    } = useContext(ToggleContext);
    const navigation = useStackNavigationContext();
    const { setRouteOptions, routeKey } = navigation;
    const screenIndex = ROUTE_NAMES.indexOf(routeName);

    const headerConfig = useMemo<StackHeaderConfigProps>(
      () => ({
        title: routeName,
        ios: {
          trailingItems: buildItems(
            LAYOUTS[routeName]!,
            screenIndex,
            identifiersEnabled,
            separatorsEnabled,
            customViewsEnabled,
          ),
        },
      }),
      [identifiersEnabled, separatorsEnabled, customViewsEnabled, screenIndex],
    );

    useLayoutEffect(() => {
      setRouteOptions(routeKey, { headerConfig });
    }, [headerConfig, setRouteOptions, routeKey]);

    const nextRoute = ROUTE_NAMES[screenIndex + 1];

    return (
      <View style={styles.container}>
        <SettingsSwitch
          label="Identifiers"
          testID="toggle-identifiers"
          value={identifiersEnabled}
          onValueChange={setIdentifiersEnabled}
        />
        <SettingsSwitch
          label="Separators"
          testID="toggle-separators"
          value={separatorsEnabled}
          onValueChange={setSeparatorsEnabled}
        />
        <SettingsSwitch
          label="Custom views"
          testID="toggle-custom-views"
          value={customViewsEnabled}
          onValueChange={setCustomViewsEnabled}
        />
        {nextRoute && (
          <Button title="Next" onPress={() => navigation.push(nextRoute)} />
        )}
        {routeName !== 'One' && (
          <Button title="Go back" onPress={() => navigation.pop(routeKey)} />
        )}
      </View>
    );
  };
}

function TestStackHeaderItemIdentifierIOS() {
  const [identifiersEnabled, setIdentifiersEnabled] = useState(true);
  const [separatorsEnabled, setSeparatorsEnabled] = useState(false);
  const [customViewsEnabled, setCustomViewsEnabled] = useState(false);

  const toggles = useMemo<Toggles>(
    () => ({
      identifiersEnabled,
      separatorsEnabled,
      customViewsEnabled,
      setIdentifiersEnabled,
      setSeparatorsEnabled,
      setCustomViewsEnabled,
    }),
    [identifiersEnabled, separatorsEnabled, customViewsEnabled],
  );

  const routeConfigs = useMemo(
    () =>
      ROUTE_NAMES.map(routeName => ({
        name: routeName,
        Component: makeScreen(routeName),
      })),
    [],
  );

  return (
    <ToggleContext.Provider value={toggles}>
      <StackContainer routeConfigs={routeConfigs} />
    </ToggleContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  customItem: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
});

export default createScenario(
  TestStackHeaderItemIdentifierIOS,
  scenarioDescription,
);

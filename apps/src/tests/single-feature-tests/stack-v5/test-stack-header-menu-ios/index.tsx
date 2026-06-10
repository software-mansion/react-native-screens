import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/gamma/stack/header';
import { Button, ScrollView } from 'react-native';
import LongText from '@apps/shared/LongText';
import { scenarioDescription } from './scenario-description';
import PressableWithFeedback from '@apps/shared/PressableWithFeedback';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

const DEFAULT_TRAILING_ITEMS_COUNT = 2;

export function App() {
  return (
    <ToastProvider>
      <StackContainer
        routeConfigs={[
          {
            name: 'Home',
            Component: ConfigScreen,
            options: {},
          },
        ]}
      />
    </ToastProvider>
  );
}

function buildHeaderConfig(
  trailingItemsCount: number,
  showToast: (text: string) => void,
): StackHeaderConfigProps {
  const trailingItems: NonNullable<
    StackHeaderConfigProps['ios']
  >['trailingItems'] = Array.from({ length: trailingItemsCount }).map(
    (_, i) => ({
      type: 'item',
      key: `trailing-${i}`,
      label: `Menu ${i}`,
      // every second item is custom
      ...(i % 2 === 0 && {
        render: () => (
          <PressableWithFeedback style={{ width: 30, height: 30 }} />
        ),
      }),
      menu: {
        type: 'menu',
        menuElementId: `menu-${i}`,
        children: [
          {
            menuElementId: `subitem-${i}-1`,
            type: 'menuItem',
            title: `Item ${i}.1`,
            onPress: () => showToast(`Clicked Item ${i}.1`),
          },
          {
            menuElementId: `subitem-${i}-2`,
            type: 'menuItem',
            title: `Item ${i}.2`,
            onPress: () => showToast(`Clicked Item ${i}.2`),
          },
          {
            menuElementId: `submenu-${i}`,
            type: 'menu',
            title: `Submenu ${i}`,
            children: [
              {
                menuElementId: `subsubitem-${i}-1`,
                type: 'menuItem',
                title: `Nested ${i}.1`,
                onPress: () => showToast(`Clicked Nested ${i}.1`),
              },
              {
                menuElementId: `subsubitem-${i}-2`,
                type: 'menuItem',
                title: `Nested ${i}.2`,
                onPress: () => showToast(`Clicked Nested ${i}.2`),
              },
            ],
          },
        ],
      },
    }),
  );

  return {
    title: 'Header Menu',
    ios: {
      trailingItems,
    },
  };
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const toast = useToast();
  const [trailingItemsCount, setTrailingItemsCount] = useState<number>(
    DEFAULT_TRAILING_ITEMS_COUNT,
  );

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () => buildHeaderConfig(trailingItemsCount, showToast),
    [trailingItemsCount, showToast],
  );

  useEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title={`Toggle trailing items count (${trailingItemsCount}/4)`}
        onPress={() => setTrailingItemsCount(count => (count + 1) % 5)}
      />
      <LongText />
    </ScrollView>
  );
}

export default createScenario(App, scenarioDescription);

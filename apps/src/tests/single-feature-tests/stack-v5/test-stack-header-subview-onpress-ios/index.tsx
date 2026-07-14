import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/gamma/stack/header';
import { Button, ScrollView } from 'react-native';
import LongText from '@apps/shared/LongText';
import { scenarioDescription } from './scenario-description';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

const MAX_ITEMS = 5;

export function TestStackHeaderSubviewsOnpressIOS() {
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
  itemsCount: number,
  showToast: (text: string) => void,
): StackHeaderConfigProps {
  const trailingItems: NonNullable<
    StackHeaderConfigProps['ios']
  >['trailingItems'] = Array.from({ length: itemsCount }).map((_, i) => ({
    type: 'item',
    id: `item-${i}`,
    title: i % 2 == 0 ? `Item ${i}` : `Menu ${i}`,
    ...(i % 2 == 0 && { onPress: () => showToast(`onPress Item ${i}`) }),
    menu: {
      type: 'menu',
      id: `menu-${i}`,
      children: [
        {
          id: `action-${i}-1`,
          type: 'menuItem',
          itemType: 'action',
          title: `Action ${i}-1`,
          onPress: () => showToast(`Action ${i}-1`),
        },
        {
          id: `action-${i}-2`,
          type: 'menuItem',
          itemType: 'action',
          title: `Action ${i}-2`,
          onPress: () => showToast(`Action ${i}-2`),
        },
      ],
    },
  }));

  return {
    title: 'Header onPress',
    ios: {
      trailingItems,
    },
  };
}

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const toast = useToast();
  const [itemsCount, setItemsCount] = useState(2);

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () => buildHeaderConfig(itemsCount, showToast),
    [itemsCount, showToast],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title={`Toggle items count (${itemsCount}/${MAX_ITEMS})`}
        onPress={() => setItemsCount(count => (count + 1) % (MAX_ITEMS + 1))}
      />
      <LongText />
    </ScrollView>
  );
}

export default createScenario(
  TestStackHeaderSubviewsOnpressIOS,
  scenarioDescription,
);

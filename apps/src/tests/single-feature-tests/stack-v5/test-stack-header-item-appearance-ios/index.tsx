import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { StackHeaderConfigProps } from 'react-native-screens/components/stack/header';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { SettingsSwitch, ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

const buildHeaderConfig = (
  overflow: boolean,
  showToast: (text: string) => void,
): StackHeaderConfigProps => ({
  title: 'Item Appearance',
  ios: {
    trailingItems: [
      {
        // TODO: make this item prominent once prominent style is implemented
        type: 'item',
        title: 'Prominent Disabled',
        id: 'prominent-disabled-item',
        icon: { type: 'sfSymbol', name: '4.circle' },
        disabled: true,
        onPress: () => showToast('Prominent disabled item pressed'),
      },
      {
        type: 'spacer',
        id: 'spacer-0',
        sizing: 'flexible',
      },
      {
        // TODO: make this item prominent once prominent style is implemented
        type: 'item',
        title: 'Prominent',
        id: 'prominent-item',
        icon: { type: 'sfSymbol', name: '3.circle' },
        onPress: () => showToast('Prominent item pressed'),
      },
      {
        type: 'spacer',
        id: 'spacer-1',
        sizing: 'flexible',
      },
      {
        type: 'item',
        title: 'Disabled',
        id: 'disabled-item',
        icon: { type: 'sfSymbol', name: '2.circle' },
        disabled: true,
        onPress: () => showToast('Disabled item pressed'),
      },
      {
        type: 'spacer',
        id: 'spacer-2',
        sizing: 'flexible',
      },
      {
        type: 'item',
        title: 'Regular',
        id: 'regular-item',
        icon: { type: 'sfSymbol', name: '1.circle' },
        onPress: () => showToast('Regular item pressed'),
      },
      ...(overflow
        ? [
            {
              type: 'item',
              id: 'wide-custom-item',
              render: () => <View style={styles.wideCustomItem} />,
            } as const,
          ]
        : []),
    ],
  },
});

function ConfigScreen() {
  const navigation = useStackNavigationContext();
  const toast = useToast();
  const [overflow, setOverflow] = useState(false);

  const showToast = useCallback(
    (text: string) => {
      toast.push({ backgroundColor: Colors.GreenDark120, message: text });
    },
    [toast],
  );

  const { setRouteOptions, routeKey } = navigation;
  const headerConfig = useMemo(
    () => buildHeaderConfig(overflow, showToast),
    [overflow, showToast],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig,
    });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}>
      <Text style={styles.label}>
        Header shows 4 items: regular (1), disabled (2), prominent (3),
        prominent disabled (4)
      </Text>
      <SettingsSwitch
        label="Push to overflow"
        testID="push-to-overflow-switch"
        value={overflow}
        onValueChange={setOverflow}
      />
    </ScrollView>
  );
}

function TestStackHeaderItemAppearanceIOS() {
  return (
    <ToastProvider>
      <StackContainer
        routeConfigs={[
          {
            name: 'Home',
            element: <ConfigScreen />,
          },
        ]}
      />
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    padding: 16,
  },
  wideCustomItem: {
    width: 500,
    height: 20,
    backgroundColor: 'black',
  },
});

export default createScenario(
  TestStackHeaderItemAppearanceIOS,
  scenarioDescription,
);

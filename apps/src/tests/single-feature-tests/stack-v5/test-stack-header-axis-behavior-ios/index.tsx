import React, { useLayoutEffect, useMemo, useState } from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import type {
  StackHeaderConfigProps,
  StackHeaderItemAxisBehaviorIOS,
} from 'react-native-screens/components/stack/header';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

const behaviors: StackHeaderItemAxisBehaviorIOS[] = [
  'automatic',
  'horizontalOnly',
  'verticalPreferred',
];

function Screen({ second = false }: { second?: boolean }) {
  const navigation = useStackNavigationContext();
  const { setRouteOptions, routeKey } = navigation;
  const [nativeAxis, setNativeAxis] = useState<
    StackHeaderItemAxisBehaviorIOS | undefined
  >('horizontalOnly');
  const [customAxis, setCustomAxis] = useState<
    StackHeaderItemAxisBehaviorIOS | undefined
  >('verticalPreferred');
  const [visible, setVisible] = useState(true);
  const [separated, setSeparated] = useState(false);
  const [presses, setPresses] = useState(0);

  const headerConfig = useMemo<StackHeaderConfigProps>(
    () => ({
      title: second ? 'Axis two' : 'Axis one',
      ios: {
        trailingItems: visible
          ? [
              {
                id: 'native',
                type: 'item',
                identifier: 'axis-native',
                icon: {
                  type: 'sfSymbol',
                  name: second ? 'moon.fill' : 'sun.max.fill',
                },
                axisBehavior: nativeAxis,
                onPress: () => setPresses(count => count + 1),
              },
              ...(separated
                ? [
                    {
                      id: 'gap',
                      type: 'spacer' as const,
                      sizing: 'fixed' as const,
                      width: 12,
                    },
                  ]
                : []),
              {
                id: 'custom',
                type: 'item',
                identifier: 'axis-custom',
                axisBehavior: customAxis,
                render: () => (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Custom axis item"
                    testID="custom-axis-item"
                    onPress={() => setPresses(count => count + 1)}
                    style={styles.customItem}>
                    <Text style={styles.customText}>{second ? 'B' : 'A'}</Text>
                  </Pressable>
                ),
              },
            ]
          : [],
      },
    }),
    [second, visible, separated, nativeAxis, customAxis],
  );

  useLayoutEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, routeKey, setRouteOptions]);

  return (
    <View style={styles.container}>
      <Text>Native: {nativeAxis ?? 'omitted'}</Text>
      <Text>Custom: {customAxis ?? 'omitted'}</Text>
      <Text testID="axis-press-count">Presses: {presses}</Text>
      {behaviors.map(behavior => (
        <Button
          key={`native-${behavior}`}
          title={`Native ${behavior}`}
          onPress={() => setNativeAxis(behavior)}
        />
      ))}
      {behaviors.map(behavior => (
        <Button
          key={`custom-${behavior}`}
          title={`Custom ${behavior}`}
          onPress={() => setCustomAxis(behavior)}
        />
      ))}
      <Button
        title="Remove axis options"
        onPress={() => {
          setNativeAxis(undefined);
          setCustomAxis(undefined);
        }}
      />
      <Button
        title="Toggle items"
        onPress={() => setVisible(value => !value)}
      />
      <Button
        title="Toggle separator"
        onPress={() => setSeparated(value => !value)}
      />
      <Button
        title={second ? 'Pop' : 'Push'}
        onPress={() =>
          second ? navigation.pop(routeKey) : navigation.push('Two')
        }
      />
    </View>
  );
}

function TestStackHeaderAxisBehaviorIOS() {
  return (
    <StackContainer
      routeConfigs={[
        { name: 'One', element: <Screen /> },
        { name: 'Two', element: <Screen second /> },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  customItem: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#287848',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default createScenario(
  TestStackHeaderAxisBehaviorIOS,
  scenarioDescription,
);

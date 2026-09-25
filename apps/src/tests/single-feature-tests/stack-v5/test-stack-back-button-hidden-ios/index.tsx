import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function TestStackBackButtonHiddenIOS() {
  return (
    <StackContainer
      routeConfigs={[
        {
          name: 'Root',
          element: <RootScreen />,
          options: { headerConfig: { title: 'Root' } },
        },
        {
          name: 'Visibility',
          element: <VisibilityScreen />,
          options: {
            headerConfig: { title: 'Visibility', backButtonHidden: true },
          },
        },
        {
          name: 'Default',
          element: <DefaultScreen />,
          options: { headerConfig: { title: 'Default' } },
        },
      ]}
    />
  );
}

function RootScreen() {
  const { routeKey, push, setRouteOptions } = useStackNavigationContext();
  return (
    <View style={styles.content}>
      <Text>Root never has a native back button.</Text>
      <Button
        title="Set root backButtonHidden false"
        onPress={() =>
          setRouteOptions(routeKey, {
            headerConfig: { title: 'Root', backButtonHidden: false },
          })
        }
      />
      <Button title="Push Visibility" onPress={() => push('Visibility')} />
    </View>
  );
}

function VisibilityScreen() {
  const { routeKey, push, pop, setRouteOptions } = useStackNavigationContext();
  const [hidden, setHidden] = React.useState<boolean | undefined>(true);
  const [mounted, setMounted] = React.useState(true);

  React.useLayoutEffect(() => {
    setRouteOptions(routeKey, {
      headerConfig: mounted
        ? {
            title: 'Visibility',
            ...(hidden === undefined ? {} : { backButtonHidden: hidden }),
          }
        : undefined,
    });
  }, [hidden, mounted, routeKey, setRouteOptions]);

  return (
    <View style={styles.content}>
      <Text testID="visibility-state">backButtonHidden: {String(hidden)}</Text>
      <Text>Header config: {mounted ? 'mounted' : 'removed'}</Text>
      <Button title="Set true" onPress={() => setHidden(true)} />
      <Button title="Set false" onPress={() => setHidden(false)} />
      <Button title="Remove prop" onPress={() => setHidden(undefined)} />
      <Button
        title={mounted ? 'Remove header config' : 'Mount header config'}
        onPress={() => setMounted(value => !value)}
      />
      <Button title="Push Default" onPress={() => push('Default')} />
      <Button title="Pop Visibility" onPress={() => pop(routeKey)} />
    </View>
  );
}

function DefaultScreen() {
  const { routeKey, pop } = useStackNavigationContext();
  return (
    <View style={styles.content}>
      <Text>Default screen should have a native back button.</Text>
      <Button title="Pop Default" onPress={() => pop(routeKey)} />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f4f8',
    gap: 12,
  },
});

export default createScenario(
  TestStackBackButtonHiddenIOS,
  scenarioDescription,
);

import {
  Appearance,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import React, {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
} from 'react';
import { SettingsPicker } from '@apps/shared';
import {
  StackContainer,
  useStackNavigationContext,
  type StackRouteConfig,
} from '@apps/shared/containers/stack';
import type {
  StackHeaderConfigProps,
  StackHostColorScheme,
} from 'react-native-screens';
import { Colors } from '@apps/shared/styling';

const HostConfigContext = createContext<{
  hostColorScheme: StackHostColorScheme;
  setHostColorScheme: (val: StackHostColorScheme) => void;
}>({
  hostColorScheme: 'inherit',
  setHostColorScheme: () => {},
});

function ConfigScreen() {
  const { push, setRouteOptions, routeKey } = useStackNavigationContext();
  const { hostColorScheme, setHostColorScheme } = useContext(HostConfigContext);

  const [reactColorScheme, setReactColorScheme] =
    useState<Appearance.ColorSchemeOverride>('auto');
  const [headerColorScheme, setHeaderColorScheme] =
    useState<StackHostColorScheme>('inherit');

  useEffect(() => {
    Appearance.setColorScheme(reactColorScheme);
  }, [reactColorScheme]);

  const headerConfig = useMemo<StackHeaderConfigProps>(() => {
    return {
      title: 'Config',
      android: {
        // colorScheme:
        //   headerColorScheme === 'inherit' ? undefined : headerColorScheme,
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- per-header colorScheme not implemented yet
  }, [headerColorScheme]);

  useEffect(() => {
    setRouteOptions(routeKey, { headerConfig });
  }, [headerConfig, setRouteOptions, routeKey]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.text}>
          Sources of color scheme in ascending order of precedence: system,
          React Native, StackHost prop, and (on Android) the headerConfig prop.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>System color scheme</Text>
        <Text style={styles.text}>
          Switch system color scheme via quick settings in notification drawer
          (Android/iOS) or Cmd+Shift+A (iOS simulator).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>React Native's color scheme</Text>
        <SettingsPicker<Appearance.ColorSchemeOverride>
          label={'colorScheme'}
          value={reactColorScheme}
          onValueChange={setReactColorScheme}
          items={['auto', 'light', 'dark']}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>StackHost color scheme</Text>
        <SettingsPicker<StackHostColorScheme>
          label={'colorScheme'}
          value={hostColorScheme}
          onValueChange={setHostColorScheme}
          items={['inherit', 'light', 'dark']}
        />
      </View>

      {Platform.OS === 'android' && (
        <View style={styles.section}>
          <Text style={styles.heading}>
            Header config override (NOT IMPLEMENTED YET)
          </Text>
          <SettingsPicker<StackHostColorScheme>
            label={'headerConfig.android.colorScheme'}
            value={headerColorScheme}
            onValueChange={setHeaderColorScheme}
            items={['inherit', 'light', 'dark']}
          />
        </View>
      )}

      <View style={styles.section}>
        <Button title="Push Keyboard Screen" onPress={() => push('Keyboard')} />
      </View>
    </ScrollView>
  );
}

function TestScreen() {
  return (
    <View style={styles.containerCenter}>
      <TextInput placeholder="Type something..." style={styles.input} />
    </View>
  );
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Config',
    element: <ConfigScreen />,
  },
  {
    name: 'Keyboard',
    element: <TestScreen />,
    options: {
      headerConfig: {
        title: 'Keyboard',
      },
    },
  },
];

function TestStackColorScheme() {
  const [hostColorScheme, setHostColorScheme] =
    useState<StackHostColorScheme>('inherit');

  return (
    <HostConfigContext.Provider value={{ hostColorScheme, setHostColorScheme }}>
      <StackContainer
        routeConfigs={ROUTE_CONFIGS}
        colorScheme={hostColorScheme}
      />
    </HostConfigContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.cardBackground,
  },
  content: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'rgb(0, 122, 255)',
  },
  section: {
    marginBottom: 20,
  },
  text: {
    color: 'gray',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
    width: '80%',
    borderRadius: 5,
  },
});

export default createScenario(TestStackColorScheme, scenarioDescription);

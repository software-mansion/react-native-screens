import {
  Appearance,
  ColorSchemeName,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Scenario } from '../../shared/helpers';
import { createAutoConfiguredTabs } from '../../shared/tabs';
import React, { useEffect, useState } from 'react';
import { SettingsPicker } from '../../../shared';
import type { TabsHostColorScheme } from 'react-native-screens';
import useTabsConfigState from '../../shared/hooks/tabs-config';

const SCENARIO: Scenario = {
  name: 'Color Scheme',
  key: 'test-tabs-color-scheme',
  details: 'Tests how tabs handle system, React Native and prop color scheme.',
  platforms: ['android', 'ios'],
  AppComponent: App,
};

export default SCENARIO;

type TabsParamList = {
  Config: undefined;
  Keyboard: undefined;
};

function ConfigScreen() {
  const [config, dispatch] = useTabsConfigState<TabsParamList>();
  const [reactColorScheme, setReactColorScheme] =
    useState<ColorSchemeName>('unspecified');

  // TODO: Tabs.Autoconfig should allow initial prop configuration.
  useEffect(() => {
    dispatch({
      type: 'tabScreen',
      tabKey: 'Config',
      config: {
        safeAreaConfiguration: {
          edges: {
            bottom: true,
          },
        },
      },
    });
  }, [dispatch]);

  useEffect(() => {
    Appearance.setColorScheme(reactColorScheme);
  }, [reactColorScheme]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text>
          There are 3 sources of color scheme, in ascending order of precedence:
          system, React Native and our property on TabsHost.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>System color scheme</Text>
        <Text>
          Switch system color scheme via quick settings in notification drawer
          (Android/iOS) or Cmd+Shift+A (iOS simulator).
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>React Native's color scheme</Text>
        <SettingsPicker<ColorSchemeName>
          label={'colorScheme'}
          value={reactColorScheme}
          onValueChange={function (value: ColorSchemeName): void {
            setReactColorScheme(value);
          }}
          items={['unspecified', 'light', 'dark']}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>TabsHost color scheme</Text>
        <SettingsPicker<NonNullable<TabsHostColorScheme>>
          label={'colorScheme'}
          value={config.colorScheme ?? 'inherit'}
          onValueChange={function (value: TabsHostColorScheme): void {
            dispatch({
              type: 'tabBar',
              config: {
                colorScheme: value,
              },
            });
          }}
          items={['inherit', 'light', 'dark']}
        />
      </View>
    </ScrollView>
  );
}

function TestScreen() {
  return (
    <View style={styles.containerCenter}>
      <TextInput placeholder="Type something..." />
    </View>
  );
}

const Tabs = createAutoConfiguredTabs<TabsParamList>({
  Config: ConfigScreen,
  Keyboard: TestScreen,
});

export function App() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
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
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 60 : undefined,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
  },
});

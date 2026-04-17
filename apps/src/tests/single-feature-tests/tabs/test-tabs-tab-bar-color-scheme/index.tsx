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
import type { Scenario } from '@apps/tests/shared/helpers';
import React, { useEffect } from 'react';
import { SettingsPicker } from '@apps/shared';
import { Tabs, type TabsHostColorScheme } from 'react-native-screens';

const SCENARIO: Scenario = {
  name: 'Tab Bar Color Scheme',
  key: 'test-tabs-tab-bar-color-scheme',
  details: 'Tests how tabs handle system, React Native and prop color scheme.',
  platforms: ['android', 'ios'],
  AppComponent: App,
};

export default SCENARIO;

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ConfigScreen({
  colorScheme,
  setColorScheme,
}: {
  colorScheme: TabsHostColorScheme;
  setColorScheme: (value: TabsHostColorScheme) => void;
}) {
  const [reactColorScheme, setReactColorScheme] =
    React.useState<ColorSchemeName>('unspecified');

  useEffect(() => {
    Appearance.setColorScheme(reactColorScheme);
  }, [reactColorScheme]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.text}>
          There are 3 sources of color scheme, in ascending order of precedence:
          system, React Native and our property on TabsHost.
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
          value={colorScheme}
          onValueChange={value => setColorScheme(value)}
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

export function App() {
  const [colorScheme, setColorScheme] =
    React.useState<TabsHostColorScheme>('inherit');

  return (
    <Tabs.Host
      navState={{ selectedScreenKey: 'Config', provenance: 0 }}
      colorScheme={colorScheme}>
      <Tabs.Screen
        screenKey="Config"
        title="Config"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen
          colorScheme={colorScheme}
          setColorScheme={setColorScheme}
        />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="Keyboard"
        title="Keyboard"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <TestScreen />
      </Tabs.Screen>
    </Tabs.Host>
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
    color: 'rgb(0, 122, 255)',
  },
  section: {
    marginBottom: 10,
  },
  text: {
    color: 'gray',
  },
});

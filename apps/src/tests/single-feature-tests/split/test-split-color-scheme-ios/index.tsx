import {
  Appearance,
  ColorSchemeName,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  PlatformColor,
} from 'react-native';
import scenarioDescription from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import React, { useEffect, useState } from 'react';
import { SettingsPicker } from '@apps/shared';
import { Split } from 'react-native-screens/experimental';
import { SplitHostColorScheme } from 'react-native-screens/components/gamma/split/SplitHost.types';
import { SafeAreaView } from 'react-native-screens/experimental';

export function ConfigColumn({
  reactColorScheme,
  setReactColorScheme,
  hostColorScheme,
  setHostColorScheme,
}: {
  reactColorScheme: ColorSchemeName;
  setReactColorScheme: (value: ColorSchemeName) => void;
  hostColorScheme: SplitHostColorScheme;
  setHostColorScheme: (value: SplitHostColorScheme) => void;
}) {
  return (
    <View style={styles.wrappingView}>
      <SafeAreaView
        style={styles.container}
        edges={{ left: true, right: true }}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="automatic">
          <View style={styles.section}>
            <Text style={styles.text}>
              There are 3 sources of color scheme, in ascending order of
              precedence: system, React Native and our property on SplitHost.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>System color scheme</Text>
            <Text style={styles.text}>
              Switch system color scheme via Cmd+Shift+A (iOS simulator).
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>React Native's color scheme</Text>
            <SettingsPicker<ColorSchemeName>
              label={'colorScheme'}
              value={reactColorScheme}
              onValueChange={setReactColorScheme}
              items={['unspecified', 'light', 'dark']}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>SplitHost color scheme</Text>
            <SettingsPicker<NonNullable<SplitHostColorScheme>>
              label={'colorScheme'}
              value={hostColorScheme}
              onValueChange={setHostColorScheme}
              items={['inherit', 'light', 'dark']}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

export function TestColumn() {
  return (
    <View style={styles.containerCenter}>
      <TextInput placeholder="Type something..." />
    </View>
  );
}

export function App() {
  const [hostColorScheme, setHostColorScheme] =
    useState<SplitHostColorScheme>('inherit');
  const [reactColorScheme, setReactColorScheme] =
    useState<ColorSchemeName>('unspecified');

  useEffect(() => {
    Appearance.setColorScheme(reactColorScheme);
  }, [reactColorScheme]);

  return (
    <Split.Host colorScheme={hostColorScheme}>
      <Split.Column>
        <ConfigColumn
          reactColorScheme={reactColorScheme}
          setReactColorScheme={setReactColorScheme}
          hostColorScheme={hostColorScheme}
          setHostColorScheme={setHostColorScheme}
        />
      </Split.Column>
      <Split.Column>
        <TestColumn />
      </Split.Column>
    </Split.Host>
  );
}

const styles = StyleSheet.create({
  wrappingView: {
    flex: 1,
    backgroundColor: PlatformColor('systemBackgroundColor'),
  },
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

export default createScenario(App, scenarioDescription);

import React, { useState } from 'react';
import {
  Button,
  DynamicColorIOS,
  Platform,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack, type StackHeaderAppearanceIOS } from 'react-native-screens';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

const PRESETS = {
  default: undefined,
  empty: {},
  opaque: { backgroundColor: 'skyblue', shadowColor: 'red' },
  transparent: { backgroundColor: 'transparent', shadowColor: 'transparent' },
  translucent: { backgroundColor: 'rgba(0, 128, 255, 0.3)' },
  dynamic: {
    backgroundColor:
      Platform.OS === 'ios'
        ? DynamicColorIOS({ light: 'skyblue', dark: 'transparent' })
        : 'skyblue',
    shadowColor: Platform.OS === 'ios' ? PlatformColor('labelColor') : 'black',
  },
  shadow: { shadowColor: 'red' },
} satisfies Record<string, StackHeaderAppearanceIOS | undefined>;

type Preset = keyof typeof PRESETS;
const PRESET_NAMES = Object.keys(PRESETS) as Preset[];

function AppearanceControls({
  label,
  preset,
  onChange,
}: {
  label: string;
  preset: Preset;
  onChange: (value: Preset) => void;
}) {
  return (
    <View>
      <Text>
        {label}: {preset}
      </Text>
      <View style={styles.buttons}>
        {PRESET_NAMES.map(value => (
          <Button
            key={value}
            testID={`${label}-${value}`}
            title={value}
            onPress={() => onChange(value)}
          />
        ))}
      </View>
    </View>
  );
}

function TestStackHeaderBarColorsIOS() {
  const [standard, setStandard] = useState<Preset>('default');
  const [scrollEdge, setScrollEdge] = useState<Preset>('default');
  const [controlsHeight, setControlsHeight] = useState(0);

  return (
    <Stack.Host>
      <Stack.Screen screenKey="bar-colors" activityMode="attached">
        <ScrollView
          testID="bar-colors-scroll"
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: controlsHeight }}
          contentInsetAdjustmentBehavior="automatic">
          {Array.from({ length: 24 }, (_, index) => (
            <View
              key={index}
              style={[styles.row, index % 2 === 0 && styles.alternateRow]}>
              <Text>
                Row {index + 1}. Scroll to compare the bar appearances.
              </Text>
            </View>
          ))}
        </ScrollView>
        <View
          style={styles.controls}
          onLayout={event =>
            setControlsHeight(event.nativeEvent.layout.height)
          }>
          <AppearanceControls
            label="standard"
            preset={standard}
            onChange={setStandard}
          />
          <AppearanceControls
            label="scrollEdge"
            preset={scrollEdge}
            onChange={setScrollEdge}
          />
          <Button
            title="Reset both"
            onPress={() => {
              setStandard('default');
              setScrollEdge('default');
            }}
          />
        </View>
        <Stack.HeaderConfig
          title="Bar appearance colors"
          ios={{
            largeTitleEnabled: true,
            standardAppearance: PRESETS[standard],
            scrollEdgeAppearance: PRESETS[scrollEdge],
          }}
        />
      </Stack.Screen>
    </Stack.Host>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: 'white' },
  row: { padding: 24, backgroundColor: 'white' },
  alternateRow: { backgroundColor: 'palegoldenrod' },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingBottom: 36,
    backgroundColor: 'white',
    gap: 8,
  },
  buttons: { flexDirection: 'row', flexWrap: 'wrap' },
});

export default createScenario(TestStackHeaderBarColorsIOS, scenarioDescription);

import LongText from '@apps/shared/LongText';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Tabs } from 'react-native-screens';

const scenarioDescription: ScenarioDescription = {
  name: 'Bottom Accessory',
  key: 'bottom-accessory-layout',
  details: 'Test tabs bottom accessory with various contents',
  platforms: ['ios'],
};

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ShortViewUL() {
  return (
    <View
      style={[
        styles.shortView,
        { alignItems: 'flex-start', justifyContent: 'flex-start' },
      ]}>
      <Text style={styles.shortViewText}>Upper Left</Text>
    </View>
  );
}

function ShortViewC() {
  return (
    <View
      style={[
        styles.shortView,
        { alignItems: 'center', justifyContent: 'center' },
      ]}>
      <Text style={styles.shortViewText}>Center</Text>
    </View>
  );
}

function ShortViewLR() {
  return (
    <View
      style={[
        styles.shortView,
        { alignItems: 'flex-end', justifyContent: 'flex-end' },
      ]}>
      <Text style={styles.shortViewText}>Lower Right</Text>
    </View>
  );
}

function LongView() {
  return (
    <View style={styles.fullView}>
      <LongText />
    </View>
  );
}

function RGBView() {
  return (
    <View style={styles.fullView}>
      <View style={[styles.rgbStrip, { backgroundColor: '#ff4d4d' }]} />
      <View style={[styles.rgbStrip, { backgroundColor: '#4dff4d' }]} />
      <View style={[styles.rgbStrip, { backgroundColor: '#4d4dff' }]} />
    </View>
  );
}

const ACCESSORY_VARIANTS = [
  { id: 0, content: ShortViewUL },
  { id: 1, content: ShortViewC },
  { id: 2, content: ShortViewLR },
  { id: 3, content: LongView },
  { id: 4, content: RGBView },
];

function ConfigScreen({
  selected,
  setSelected,
}: {
  selected: number;
  setSelected: (id: number) => void;
}) {
  return (
    <ScrollView style={styles.container}>
      {ACCESSORY_VARIANTS.map(item => (
        <Pressable
          key={item.id}
          onPress={() => setSelected(item.id)}
          style={[
            styles.card,
            selected === item.id ? styles.selectedCard : styles.unselectedCard,
          ]}>
          {item.content}
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function App() {
  const [selected, setSelected] = useState(0);

  return (
    <Tabs.Host
      navState={{ selectedScreenKey: 'Tab1', provenance: 0 }}
      ios={{
        bottomAccessory: () => {
          const Content = ACCESSORY_VARIANTS[selected].content;
          return <Content />;
        },
      }}>
      <Tabs.Screen
        screenKey="Tab1"
        title="Tab1"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen selected={selected} setSelected={setSelected} />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="Tab2"
        title="Tab2"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <DummyScreen />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  shortView: {
    flex: 1,
  },
  shortViewText: {
    backgroundColor: '#4dff4d',
  },
  fullView: {
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
    padding: 20,
  },
  card: {
    flex: 1,
    height: 60,
    marginTop: 20,
    borderRadius: 8,
    borderWidth: 2,
    overflow: 'hidden',
  },
  selectedCard: {
    borderColor: '#007AFF',
  },
  unselectedCard: {
    borderColor: '#ddd',
  },
  rgbStrip: {
    flex: 1,
  },
});

export default createScenario(App, scenarioDescription);

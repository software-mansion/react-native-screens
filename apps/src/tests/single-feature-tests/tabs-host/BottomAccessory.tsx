import LongText from '../../../shared/LongText';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { DummyScreen } from '../../shared/DummyScreens';
import { useDispatchTabsConfig } from '../../shared/hooks/tabs-config';
import { createAutoConfiguredTabs } from '../../shared/tabs';

type TabsParamList = {
  Tab1: undefined;
  Tab2: undefined;
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

function ConfigScreen() {
  const [selected, setSelected] = useState(0);
  const dispatch = useDispatchTabsConfig();

  useEffect(() => {
    dispatch({
      type: 'tabBar',
      config: { bottomAccessory: ACCESSORY_VARIANTS[selected].content },
    });
  }, [selected]);

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

const Tabs = createAutoConfiguredTabs<TabsParamList>({
  Tab1: ConfigScreen,
  Tab2: DummyScreen,
});

export default function BottomAccessory() {
  return (
    <Tabs.Provider>
      <Tabs.Autoconfig />
    </Tabs.Provider>
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

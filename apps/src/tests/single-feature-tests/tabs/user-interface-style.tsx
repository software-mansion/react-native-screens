import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, type TabsHostProps } from 'react-native-screens';

type UserInterfaceStyle = NonNullable<TabsHostProps['userInterfaceStyle']>;

const SCENARIO = {
  name: 'User Interface Style',
  key: 'user-interface-style',
  details:
    'Tests userInterfaceStyle on TabsHost. Forces light style even in dark mode to prevent tab bar flash.',
  platforms: ['ios'] as const,
  AppComponent: App,
};

export default SCENARIO;

const STYLE_OPTIONS: { label: string; value: UserInterfaceStyle }[] = [
  { label: 'Unspecified (system)', value: 'unspecified' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

function Tab1() {
  return (
    <ScrollView
      style={styles.tab}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.title}>Tab 1</Text>
      <Text style={styles.description}>
        This test verifies that userInterfaceStyle on TabsHost forces the tab
        bar appearance. Set your device to dark mode, then select "Light" — the
        tab bar should stay light without any flash.
      </Text>
    </ScrollView>
  );
}

function Tab2() {
  return (
    <ScrollView
      style={styles.tab}
      contentInsetAdjustmentBehavior="automatic">
      <Text style={styles.title}>Tab 2</Text>
      <Text style={styles.description}>
        Navigate between tabs and verify no dark mode flash occurs on the tab
        bar when userInterfaceStyle is set to "light".
      </Text>
    </ScrollView>
  );
}

function App() {
  const [style, setStyle] = useState<UserInterfaceStyle>('light');
  const [focusedTab, setFocusedTab] = useState('Tab1');
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={[styles.pickerContainer, { paddingTop: insets.top + 8 }]}>
        {STYLE_OPTIONS.map(option => (
          <Pressable
            key={option.value}
            onPress={() => setStyle(option.value)}
            style={[
              styles.option,
              style === option.value && styles.optionSelected,
            ]}>
            <Text
              style={[
                styles.optionText,
                style === option.value && styles.optionTextSelected,
              ]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Tabs.Host
        userInterfaceStyle={style}
        onNativeFocusChange={e => setFocusedTab(e.nativeEvent.tabKey)}
        nativeContainerStyle={{ backgroundColor: 'white' }}>
        <Tabs.Screen
          tabKey="Tab1"
          title="Tab 1"
          isFocused={focusedTab === 'Tab1'}
          icon={{ ios: { type: 'sfSymbol', name: 'house.fill' } }}>
          <Tab1 />
        </Tabs.Screen>
        <Tabs.Screen
          tabKey="Tab2"
          title="Tab 2"
          isFocused={focusedTab === 'Tab2'}
          icon={{ ios: { type: 'sfSymbol', name: 'gear' } }}>
          <Tab2 />
        </Tabs.Screen>
      </Tabs.Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pickerContainer: {
    flexDirection: 'row',
    padding: 8,
    gap: 8,
    backgroundColor: 'white',
    zIndex: 1,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    fontSize: 13,
    color: '#333',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: '600',
  },
  tab: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

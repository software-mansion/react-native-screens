import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen, ScreenContainer } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';
import { scenarioDescription } from './scenario-description';

const BAR_HEIGHT = 64;
const BAR_MARGIN = 8;
const BAR_INSET = BAR_HEIGHT + 2 * BAR_MARGIN;

const TABS = ['List', 'SafeAreaView'] as const;
type Tab = (typeof TABS)[number];

function ListTab() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      testID="additional-insets-scroll-view">
      {Array.from({ length: 30 }, (_, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.rowText}>Row {index + 1}</Text>
        </View>
      ))}
      <View style={[styles.row, styles.lastRow]}>
        <Text style={styles.rowText}>Last row</Text>
      </View>
    </ScrollView>
  );
}

function SafeAreaViewTab() {
  return (
    <SafeAreaView
      edges={{ top: true, bottom: true, left: true, right: true }}
      style={styles.safeArea}>
      <Text style={styles.rowText}>
        The red border is the SafeAreaView frame. Its bottom edge stays above
        the floating bar when the insets are on.
      </Text>
    </SafeAreaView>
  );
}

function TestStackV4AdditionalSafeAreaInsetsIOS() {
  const [selectedTab, setSelectedTab] = useState<Tab>('List');
  const [insetsEnabled, setInsetsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <ScreenContainer style={styles.container}>
        {TABS.map(tab => (
          <Screen
            key={tab}
            style={StyleSheet.absoluteFill}
            activityState={tab === selectedTab ? 2 : 0}
            additionalSafeAreaInsets={
              insetsEnabled ? { bottom: BAR_INSET } : undefined
            }>
            {tab === 'List' ? <ListTab /> : <SafeAreaViewTab />}
          </Screen>
        ))}
      </ScreenContainer>
      <SafeAreaView
        edges={{ bottom: true, left: true, right: true }}
        style={styles.barContainer}
        pointerEvents="box-none">
        <View style={styles.bar}>
          {TABS.map(tab => (
            <Pressable
              key={tab}
              testID={`additional-insets-tab-${tab}`}
              onPress={() => setSelectedTab(tab)}
              style={[
                styles.barItem,
                tab === selectedTab && styles.barItemSelected,
              ]}>
              <Text style={styles.barText}>{tab}</Text>
            </Pressable>
          ))}
          <Pressable
            testID="additional-insets-toggle"
            onPress={() => setInsetsEnabled(value => !value)}
            style={styles.barItem}>
            <Text style={styles.barText}>
              Insets: {insetsEnabled ? 'on' : 'off'}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default createScenario(
  TestStackV4AdditionalSafeAreaInsetsIOS,
  scenarioDescription,
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.cardBorder,
  },
  lastRow: {
    backgroundColor: Colors.GreenLight40,
  },
  rowText: {
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
    padding: 16,
    borderWidth: 6,
    borderColor: Colors.RedLight100,
  },
  barContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  bar: {
    height: BAR_HEIGHT,
    margin: BAR_MARGIN,
    borderRadius: BAR_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    backgroundColor: Colors.PurpleLight80,
    opacity: 0.9,
  },
  barItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  barItemSelected: {
    backgroundColor: Colors.PurpleLight40,
  },
  barText: {
    fontSize: 15,
    fontWeight: '600',
  },
});

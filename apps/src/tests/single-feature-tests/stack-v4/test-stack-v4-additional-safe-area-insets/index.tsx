import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
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

function ListRows() {
  return (
    <>
      {Array.from({ length: 30 }, (_, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.rowText}>Row {index + 1}</Text>
        </View>
      ))}
      <View style={[styles.row, styles.lastRow]}>
        <Text style={styles.rowText}>Last row</Text>
      </View>
    </>
  );
}

function ListTab() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      testID="additional-insets-scroll-view">
      {Platform.OS === 'android' ? (
        <SafeAreaView edges={{ top: true, bottom: true }}>
          <ListRows />
        </SafeAreaView>
      ) : (
        <ListRows />
      )}
    </ScrollView>
  );
}

function SafeAreaContextInsets() {
  const insets = useSafeAreaInsets();
  return (
    <Text style={styles.rowText} testID="additional-insets-context-insets">
      useSafeAreaInsets: top {Math.round(insets.top)}, bottom{' '}
      {Math.round(insets.bottom)}
    </Text>
  );
}

function SafeAreaViewTab() {
  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView
        edges={{ top: true, bottom: true, left: true, right: true }}
        style={styles.container}>
        <View style={styles.safeAreaContent}>
          <Text style={styles.rowText}>
            The red border fills the SafeAreaView. Its bottom edge stays above
            the floating bar when the insets are on.
          </Text>
          <View style={styles.contextInsets}>
            <SafeAreaContextInsets />
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TestStackV4AdditionalSafeAreaInsets() {
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
  TestStackV4AdditionalSafeAreaInsets,
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
  safeAreaContent: {
    flex: 1,
    padding: 16,
    borderWidth: 6,
    borderColor: Colors.RedLight100,
  },
  contextInsets: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

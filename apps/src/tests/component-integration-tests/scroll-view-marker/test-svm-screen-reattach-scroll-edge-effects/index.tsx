import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigation,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ScrollViewMarker } from 'react-native-screens';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Colors } from '@apps/shared/styling';
import { generateNextColor } from '@apps/shared/utils/color-generator';

// Taken once at module scope so the colors stay stable across re-renders
// (generateNextColor advances a global counter on every call).
const ROW_COLORS = Array.from({ length: 30 }, () => generateNextColor());

function List() {
  return (
    <ScrollView
      style={styles.fillParent}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.listContent}>
      {ROW_COLORS.map((color, index) => (
        <View key={index} style={[styles.row, { backgroundColor: color }]}>
          <Text style={styles.rowText}>Row {index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function MarkerList() {
  return (
    <ScrollViewMarker
      style={styles.fillParent}
      scrollEdgeEffects={{ top: 'soft' }}>
      <List />
    </ScrollViewMarker>
  );
}

const NativeStack = createNativeStackNavigator();

function MarkerStack() {
  return (
    <NativeStack.Navigator screenOptions={{ headerTransparent: true }}>
      <NativeStack.Screen
        name="MarkerList"
        component={MarkerList}
        options={{ title: 'ScrollViewMarker' }}
      />
    </NativeStack.Navigator>
  );
}

function ScreenPropStack() {
  return (
    <NativeStack.Navigator screenOptions={{ headerTransparent: true }}>
      <NativeStack.Screen
        name="ScreenPropList"
        component={List}
        options={{ title: 'Screen prop', scrollEdgeEffects: { top: 'soft' } }}
      />
    </NativeStack.Navigator>
  );
}

function RecycleStart() {
  const navigation = useNavigation();
  return (
    <View style={[styles.fillParent, styles.buttons]}>
      <Button
        title="Push hidden"
        testID="svm-reattach-push-hidden"
        onPress={() => navigation.navigate('Hidden' as never)}
      />
      <Button
        title="Push automatic"
        testID="svm-reattach-push-automatic"
        onPress={() => navigation.navigate('Automatic' as never)}
      />
    </View>
  );
}

function RecycleStack() {
  return (
    <NativeStack.Navigator screenOptions={{ headerTransparent: true }}>
      <NativeStack.Screen
        name="RecycleStart"
        component={RecycleStart}
        options={{ title: 'Recycle' }}
      />
      <NativeStack.Screen
        name="Hidden"
        component={List}
        options={{ title: 'Hidden', scrollEdgeEffects: { top: 'hidden' } }}
      />
      <NativeStack.Screen
        name="Automatic"
        component={List}
        options={{ title: 'Automatic' }}
      />
    </NativeStack.Navigator>
  );
}

const BottomTabs = createBottomTabNavigator();

function TestSvmScreenReattachScrollEdgeEffects() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <BottomTabs.Navigator screenOptions={{ headerShown: false }}>
          <BottomTabs.Screen name="Marker" component={MarkerStack} />
          <BottomTabs.Screen name="ScreenProp" component={ScreenPropStack} />
          <BottomTabs.Screen name="Recycle" component={RecycleStack} />
        </BottomTabs.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  fillParent: {
    flex: 1,
  },
  buttons: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  listContent: {
    gap: 8,
  },
  row: {
    height: 72,
    marginHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  rowText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.White,
  },
});

export default createScenario(
  TestSvmScreenReattachScrollEdgeEffects,
  scenarioDescription,
);

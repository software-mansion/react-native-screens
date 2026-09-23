import React from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4702
//
// Native tabs + nested native stack. On iOS 27, re-tapping the active tab to
// pop to root and immediately switching to another tab can leave JS out of sync
// with UIKit (nested screen "comes back" when returning to the first tab).
//
// Steps:
// 1. First tab → Go to nested screen
// 2. Re-tap First tab (pop to root)
// 3. Immediately tap Second tab
// 4. Tap First tab again
// Expected: First tab home. Bug: Nested screen reappears (iOS 27).

type FirstTabStackParamList = {
  FirstTabHome: undefined;
  NestedScreen: undefined;
};

type TabParamList = {
  FirstTab: undefined;
  SecondTab: undefined;
  ThirdTab: undefined;
};

const Tabs = createNativeBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<FirstTabStackParamList>();

function FirstTabHome({
  navigation,
}: NativeStackScreenProps<FirstTabStackParamList, 'FirstTabHome'>) {
  return (
    <View style={styles.screen} testID="test4702-first-tab-home">
      <Text style={styles.title}>First tab</Text>
      <Text style={styles.description}>
        1. Go to nested screen{'\n'}
        2. Re-tap First tab{'\n'}
        3. Immediately tap Second tab{'\n'}
        4. Tap First again — expect home, not nested (iOS 27)
      </Text>
      <Button
        title="Go to nested screen"
        testID="test4702-go-nested"
        onPress={() => navigation.navigate('NestedScreen')}
      />
    </View>
  );
}

function NestedScreen({
  navigation,
}: NativeStackScreenProps<FirstTabStackParamList, 'NestedScreen'>) {
  return (
    <View style={styles.screen} testID="test4702-nested-screen">
      <Text style={styles.title}>Nested screen</Text>
      <Text style={styles.description}>
        This screen is inside the first tab's native stack.
      </Text>
      <Button
        title="Go back"
        testID="test4702-go-back"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function FirstTab() {
  return (
    <Stack.Navigator screenOptions={{ headerBackButtonDisplayMode: 'minimal' }}>
      <Stack.Screen
        name="FirstTabHome"
        component={FirstTabHome}
        options={{ title: 'First tab' }}
      />
      <Stack.Screen
        name="NestedScreen"
        component={NestedScreen}
        options={{ title: 'Nested screen' }}
      />
    </Stack.Navigator>
  );
}

function SecondTab() {
  return (
    <SafeAreaView style={styles.screen} testID="test4702-second-tab">
      <Text style={styles.title}>Second tab</Text>
    </SafeAreaView>
  );
}

function ThirdTab() {
  return (
    <SafeAreaView style={styles.screen} testID="test4702-third-tab">
      <Text style={styles.title}>Third tab</Text>
    </SafeAreaView>
  );
}

export default function Test4702() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tabs.Navigator screenOptions={{ headerShown: false }}>
          <Tabs.Screen
            name="FirstTab"
            component={FirstTab}
            options={{
              title: 'First',
              tabBarIcon: Platform.select({
                ios: { type: 'sfSymbol', name: 'house' },
              }),
            }}
          />
          <Tabs.Screen
            name="SecondTab"
            component={SecondTab}
            options={{
              title: 'Second',
              tabBarIcon: Platform.select({
                ios: { type: 'sfSymbol', name: 'star' },
              }),
            }}
          />
          <Tabs.Screen
            name="ThirdTab"
            component={ThirdTab}
            options={{
              title: 'Third',
              tabBarIcon: Platform.select({
                ios: { type: 'sfSymbol', name: 'gearshape' },
              }),
            }}
          />
        </Tabs.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
});

import React, { useEffect, useState } from 'react';
import {
  Button,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

type FirstTabStackParamList = {
  FirstTabHome: undefined;
  Sheet: { isDelayed: boolean };
};

type SheetStackParamList = {
  SheetContent: { isDelayed: boolean };
};

type TabParamList = {
  FirstTab: undefined;
  SecondTab: undefined;
};

const Tabs = createNativeBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<FirstTabStackParamList>();
const SheetStack = createNativeStackNavigator<SheetStackParamList>();

function FirstTabHome({
  navigation,
}: NativeStackScreenProps<FirstTabStackParamList, 'FirstTabHome'>) {
  return (
    <View style={styles.screen} testID="test4726-first-tab-home">
      <Text style={styles.description}>
        Both buttons open the same formSheet with a nested stack and a
        transparent header. In both cases the red block should start at the very
        top of the sheet, under the header. Before the fix, the first button
        pushes it down by the header height.
      </Text>
      <Button
        title="Open (ScrollView on first frame)"
        testID="test4726-open-immediate"
        onPress={() => navigation.navigate('Sheet', { isDelayed: false })}
      />
      <Button
        title="Open (ScrollView after 300ms)"
        testID="test4726-open-delayed"
        onPress={() => navigation.navigate('Sheet', { isDelayed: true })}
      />
    </View>
  );
}

function SheetContent({
  route,
}: NativeStackScreenProps<SheetStackParamList, 'SheetContent'>) {
  const [isReady, setIsReady] = useState(!route.params.isDelayed);

  useEffect(() => {
    if (isReady) {
      return;
    }
    const timeout = setTimeout(() => setIsReady(true), 300);
    return () => clearTimeout(timeout);
  }, [isReady]);

  if (!isReady) {
    return <View style={styles.loading} />;
  }

  return (
    <ScrollView testID="test4726-sheet-scroll-view">
      <View style={styles.hero}>
        <Text style={styles.heroText}>
          This block should touch the top of the sheet
        </Text>
      </View>
    </ScrollView>
  );
}

function Sheet({
  route,
}: NativeStackScreenProps<FirstTabStackParamList, 'Sheet'>) {
  return (
    <SheetStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: 'transparent' },
        headerTransparent: true,
      }}>
      <SheetStack.Screen
        name="SheetContent"
        component={SheetContent}
        initialParams={route.params}
        options={{ title: 'Sheet' }}
      />
    </SheetStack.Navigator>
  );
}

function FirstTab() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="FirstTabHome"
        component={FirstTabHome}
        options={{ title: 'First tab' }}
      />
      <Stack.Screen
        name="Sheet"
        component={Sheet}
        options={{
          headerShown: false,
          presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
        }}
      />
    </Stack.Navigator>
  );
}

function SecondTab() {
  return (
    <SafeAreaView style={styles.screen} testID="test4726-second-tab">
      <Text style={styles.description}>Second tab</Text>
    </SafeAreaView>
  );
}

export default function Test4726() {
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
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
  loading: {
    flex: 1,
  },
  hero: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    backgroundColor: 'red',
  },
  heroText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

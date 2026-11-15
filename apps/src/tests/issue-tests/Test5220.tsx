import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text, View } from 'react-native';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/pull/5220
//
// The pushed screen has a transparent header and a `hard` top scroll edge
// effect, with a ScrollView as its first child. On iOS 27 UIKit can keep the
// hard edge drawn while the content is at the top, so a dark band and a line
// show under the header before anything has scrolled. It is intermittent:
// open the screen several times (or cold launch into it).
// Expected: nothing under the header at the top; the hard edge appears once
// content scrolls under the header and disappears again back at the top.

type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

const ROWS = Array.from({ length: 30 }, (_, index) => `Row ${index + 1}`);

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.NavyDark140,
      }}>
      <Button
        title="Open screen with a hard top edge"
        onPress={() => navigation.navigate('Settings')}
        testID="home-open-settings"
      />
    </View>
  );
}

function Settings() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.NavyDark140 }}
      contentContainerStyle={{ padding: 16, gap: 8 }}
      contentInsetAdjustmentBehavior="automatic"
      testID="settings-scroll-view">
      {ROWS.map(row => (
        <View
          key={row}
          style={{
            padding: 16,
            borderRadius: 12,
            backgroundColor: Colors.NavyDark120,
          }}>
          <Text style={{ color: Colors.White }}>{row}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function Test5220() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Home' }}
        />
        <RootStack.Screen
          name="Settings"
          component={Settings}
          options={{
            title: 'Settings',
            headerTransparent: true,
            scrollEdgeEffects: {
              top: 'hard',
              bottom: 'automatic',
              left: 'automatic',
              right: 'automatic',
            },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

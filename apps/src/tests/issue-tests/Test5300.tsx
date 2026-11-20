import React from 'react';
import { Button, Text, View } from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { TabsContainer } from '@apps/shared/containers/tabs';

// A native-stack screen inside a native tab sets `statusBarStyle`. Expected:
// the status bar follows that screen. Before the fix, the lookup stopped at
// the tab bar controller, so every screen inside a tab used the outer stack's
// style ('dark' here): dark status bar text on the dark first screen.

type InnerStackParamList = {
  DarkBackground: undefined;
  LightBackground: undefined;
};

const OuterStack = createNativeStackNavigator();
const InnerStack = createNativeStackNavigator<InnerStackParamList>();

function DarkBackground({
  navigation,
}: NativeStackScreenProps<InnerStackParamList, 'DarkBackground'>) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#111',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: 'white', marginBottom: 16 }}>
        statusBarStyle: light. The status bar text should be white.
      </Text>
      <Button
        title="Push a screen with statusBarStyle: dark"
        onPress={() => navigation.push('LightBackground')}
      />
    </View>
  );
}

function LightBackground() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>statusBarStyle: dark. The status bar text should be black.</Text>
    </View>
  );
}

function StackInTab() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <InnerStack.Navigator screenOptions={{ headerShown: false }}>
          <InnerStack.Screen
            name="DarkBackground"
            component={DarkBackground}
            options={{ statusBarStyle: 'light' }}
          />
          <InnerStack.Screen
            name="LightBackground"
            component={LightBackground}
            options={{ statusBarStyle: 'dark' }}
          />
        </InnerStack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

function OtherTab() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>No statusBarStyle here: the outer stack's dark style applies.</Text>
    </View>
  );
}

function Tabs() {
  return (
    <TabsContainer
      routeConfigs={[
        {
          name: 'StackTab',
          element: <StackInTab />,
          options: { title: 'Stack' },
        },
        {
          name: 'OtherTab',
          element: <OtherTab />,
          options: { title: 'Other' },
        },
      ]}
    />
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <OuterStack.Navigator
        screenOptions={{ headerShown: false, statusBarStyle: 'dark' }}>
        <OuterStack.Screen name="Tabs" component={Tabs} />
      </OuterStack.Navigator>
    </NavigationContainer>
  );
}

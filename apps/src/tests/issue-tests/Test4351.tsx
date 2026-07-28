import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  NavigationContainer,
  type ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

type StackParamList = {
  Home: undefined;
  Plain: undefined;
  Tabs: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackParamList>;

const Stack = createNativeStackNavigator<StackParamList>();
const Tab = createBottomTabNavigator();

function HomeScreen({ navigation }: StackNavigationProp) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Issue #4351 – orientation inheritance</Text>
      <Text style={styles.paragraph}>
        The stack is locked to portrait. Push each screen and rotate the device
        to landscape to compare behavior.
      </Text>
      <View style={styles.buttons}>
        <Button
          title="Push plain screen (control)"
          onPress={() => navigation.push('Plain')}
        />
        <Button
          title="Push screen with tabs (repro)"
          onPress={() => navigation.push('Tabs')}
        />
      </View>
    </View>
  );
}

function PlainScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plain screen</Text>
      <Text style={styles.paragraph}>
        This leaf stack screen inherits `portrait` from the stack. It should
        stay portrait whether the fix is enabled or not.
      </Text>
    </View>
  );
}

function TabContent({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab {name}</Text>
      <Text style={styles.paragraph}>
        These tab screens do not set `orientation`.{'\n\n'}
        Fix ON (default): stays portrait (defers to the stack's `portrait`).
        {'\n\n'}
        Fix OFF: the tab screen forces `allButUpsideDown`, so the device can
        rotate to landscape – reproducing the bug.
      </Text>
    </View>
  );
}

function TabsScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="A">{() => <TabContent name="A" />}</Tab.Screen>
      <Tab.Screen name="B">{() => <TabContent name="B" />}</Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ orientation: 'portrait' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Plain" component={PlainScreen} />
        <Stack.Screen
          name="Tabs"
          component={TabsScreen}
          options={{ headerShown: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttons: {
    gap: 12,
  },
});

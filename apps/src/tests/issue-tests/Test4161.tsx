import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { SafeAreaView } from 'react-native-screens/experimental';

const Stack = createNativeStackNavigator();

function FirstScreen() {
  const navigation = useNavigation<any>();
  return (
    <View style={[styles.centered, styles.firstScreen]}>
      <Text style={styles.title}>First stack screen</Text>
      <Button
        title="Go to nested tabs"
        onPress={() => navigation.push('NestedTabs')}
      />
      <Button
        title="Go to regular screen"
        onPress={() => navigation.push('SecondScreen')}
      />
    </View>
  );
}

function SecondScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView edges={{ bottom: true }}>
      <View style={[styles.centered, styles.firstScreen]}>
        <Text style={styles.title}>First stack screen</Text>
        <Button title="go back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

function TabContent({ name }: { name: string }) {
  const { routeKey } = useTabsNavigationContext();
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>tab routeKey: {routeKey}</Text>
    </View>
  );
}

function HomeTab() {
  return <TabContent name="Home tab" />;
}

function SettingsTab() {
  return <TabContent name="Settings tab" />;
}

const TAB_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'HomeTab',
    Component: HomeTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Home',
      android: {
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'selected',
        },
      },
    },
  },
  {
    name: 'SettingsTab',
    Component: SettingsTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Settings',
      android: {
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'selected',
        },
      },
    },
  },
];

function NestedTabsScreen() {
  return <TabsContainer routeConfigs={TAB_ROUTE_CONFIGS} />;
}

export default function TabsNestedInStackExample() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={FirstScreen}
          options={{ title: 'First' }}
        />
        <Stack.Screen
          name="NestedTabs"
          component={NestedTabsScreen}
          options={{ title: 'Nested Tabs' }}
        />
        <Stack.Screen
          name="SecondScreen"
          component={SecondScreen}
          options={{ title: 'Second screen' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'white',
  },
  firstScreen: {
    backgroundColor: 'transparent',
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#444',
    fontSize: 16,
  },
});

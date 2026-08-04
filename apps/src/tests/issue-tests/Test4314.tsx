import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createNativeBottomTabNavigator } from '@react-navigation/bottom-tabs/unstable';

export type RootTabParamList = {
  Home: undefined;
  Settings: undefined;
};

export type SettingsStackParamList = {
  SettingsHome: undefined;
  SettingsFirst: undefined;
};

type SettingsHomeNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'SettingsHome'
>;
type SettingsFirstNavigationProp = NativeStackNavigationProp<
  SettingsStackParamList,
  'SettingsFirst'
>;

const Tabs = createNativeBottomTabNavigator<RootTabParamList>();
const Stack = createNativeStackNavigator<SettingsStackParamList>();

function StackContentHome() {
  const navigation = useNavigation<SettingsHomeNavigationProp>();

  return (
    <View style={styles.container}>
      <Button
        title="Go to SettingsFirst"
        onPress={() => navigation.navigate('SettingsFirst')}
      />
    </View>
  );
}

function StackContentFirst() {
  const navigation = useNavigation<SettingsFirstNavigationProp>();

  return (
    <View style={styles.container}>
      <Button
        title="Go to SettingsHome"
        onPress={() => navigation.navigate('SettingsHome')}
      />
    </View>
  );
}

function SettingsScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerRight: () => (
          <View collapsable={false} style={styles.headerRightBox} />
        ),
        headerBackIcon: {
          type: 'image',
          source: require('@assets/variableIcons/icon_fill.png'),
        },
      }}>
      <Stack.Screen name="SettingsHome" component={StackContentHome} />
      <Stack.Screen name="SettingsFirst" component={StackContentFirst} />
    </Stack.Navigator>
  );
}

function TabsScreen() {
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={SettingsScreen} />
      <Tabs.Screen name="Settings" component={SettingsScreen} />
    </Tabs.Navigator>
  );
}

function AppContent() {
  return (
    <NavigationContainer>
      <TabsScreen />
    </NavigationContainer>
  );
}

export default function App() {
  return <AppContent />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 100,
  },
  headerRightBox: {
    backgroundColor: 'red',
    width: 100,
    height: 100,
  },
});

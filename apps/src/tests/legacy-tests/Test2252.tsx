import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert, Button, Text, View, Switch } from 'react-native';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

function TabScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Test"
        onPress={() => {
          Alert.alert('Test');
        }}
      />
      <Switch
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        thumbColor={'#f5dd4b'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => {
          Alert.alert('Test');
        }}
      />
    </View>
  );
}

function TabsScreen() {
  return (
    <BottomTab.Navigator initialRouteName="tab">
      <BottomTab.Screen name="tab" component={TabScreen} />
    </BottomTab.Navigator>
  );
}

export function RootStackNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="tabNavigation"
      screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="tabNavigation" component={TabsScreen} />
    </RootStack.Navigator>
  );
}

function LoginScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>No tabs</Text>
    </View>
  );
}

export function LoginStackNavigator() {
  return (
    <RootStack.Navigator
      initialRouteName="login"
      screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="login" component={LoginScreen} />
    </RootStack.Navigator>
  );
}

export default function App() {
  const [showTabs, setShowTabs] = useState(true);
  return (
    <SafeAreaProvider>
      <NavigationContainer key={showTabs ? 'a' : 'b'}>
        {showTabs ? <RootStackNavigator /> : <LoginStackNavigator />}
      </NavigationContainer>
      <View style={{ marginBottom: 32 }}>
        <Button
          title="Toggle"
          onPress={() => {
            setShowTabs(!showTabs);
          }}
        />
      </View>
    </SafeAreaProvider>
  );
}

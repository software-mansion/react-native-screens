import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, View } from 'react-native';

function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Button title="Open sheet" onPress={() => navigation.navigate('Sheet')} />
      <Button
        title="Open another screen"
        onPress={() => navigation.navigate('Screen')}
      />
    </View>
  );
}

function OtherScreen({ navigation }: { navigation: any }) {
  return (
    <View style={[styles.container, { backgroundColor: 'lightsalmon' }]}>
      <Button title="Open sheet" onPress={() => navigation.navigate('Sheet')} />
    </View>
  );
}

function SheetScreen({ navigation }: { navigation: any }) {
  const handleChangeTab = () => {
    const history = navigation.getParent().getState().history;
    const isFirstTab = history[history.length - 1].key.includes('First');
    navigation.navigate(isFirstTab ? 'Second' : 'First');
  };
  return (
    <View style={styles.sheet}>
      <Button title="Dismiss" onPress={navigation.goBack} />
      <Button title="Change Tab" onPress={handleChangeTab} />
      <Button
        title="Open another screen"
        onPress={() => navigation.navigate('Screen')}
      />
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function InnerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Screen" component={OtherScreen} />
      <Stack.Screen
        name="Sheet"
        component={SheetScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
          sheetCornerRadius: 20,
          unstable_screenStyle: { backgroundColor: 'lavender' },
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="First" component={InnerStack} />
        <Tab.Screen name="Second" component={InnerStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'mediumaquamarine',
  },
  sheet: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
    backgroundColor: 'lavender',
  },
});

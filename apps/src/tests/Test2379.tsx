import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

function HomeScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <Button
        title="Go to details"
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title="Go to SecondInner"
        onPress={() => navigation.navigate('SecondInner')}
      />
    </View>
  );
}

function SecondScreen({ navigation }: { navigation: any }) {
  return (
    <View style={[styles.container, { backgroundColor: 'lightsalmon' }]}>
      <Button
        title="Go to details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({ navigation }: { navigation: any }) {
  const handleChangeTab = () => {
    const history = navigation.getParent().getState().history;
    const isFirstTab = history[history.length - 1].key.includes('First');
    navigation.navigate(isFirstTab ? 'Second' : 'First');
  };
  return (
    <View style={styles.container}>
      <Text>Details</Text>
      <Button title="Dismiss" onPress={navigation.goBack} />
      <Button title="Change Tab" onPress={handleChangeTab} />
      <Button
        title="Go to SecondInner"
        onPress={() => navigation.navigate('SecondInner')}
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
      <Stack.Screen name="SecondInner" component={SecondScreen} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.5, 1],
          unstable_screenStyle: { backgroundColor: 'white' },
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
  container: { justifyContent: 'center', alignItems: 'center' },
});

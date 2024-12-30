import { View, Button, StyleSheet } from 'react-native';
import {  NavigationContainer } from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Square } from '../shared';

type FirstStackParamList = {
  Home: undefined;
  Details: undefined;
};

type SecondStackParamList = {
  Settings: undefined;
  Info: undefined;
};

const HomeScreen = ({
  navigation,
}: NativeStackScreenProps<FirstStackParamList>) => {

  useLayoutEffect(() => {
    // Set initial title
    navigation.setOptions({
      title: 'Initial Title',
    });

    // Set headerLeft and headerRight after 2 seconds
    const timer1 = setTimeout(() => {
      navigation.setOptions({
        headerLeft: () =>  <Square size={16} color="goldenrod" />,
        headerRight: () => <Square size={20} color="green" />,
      });
    }, 3000);

    // Clean up timers
    return () => {
      clearTimeout(timer1);
    };
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Button
        title={'Go to details'}
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
};

const DetailsScreen = ({
  navigation,
}: NativeStackScreenProps<FirstStackParamList>) => {
  const [x, setX] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      headerBackVisible: !x,
      headerRight: () =>
        x ? <Square size={20} color="green" /> : <Square size={10} />,
    });
  }, [navigation, x]);

  return <Button title="Toggle subviews" onPress={() => setX(prev => !prev)} />;
};

const InfoScreen = ({
  navigation,
}: NativeStackScreenProps<SecondStackParamList>) => {
  const [hasLeftItem, setHasLeftItem] = useState(false);

  const square1 = (props: { tintColor?: string }) => (
    <View style={{ gap: 8, flexDirection: 'row' }}>
      {hasLeftItem && <Square {...props} color="green" size={20} />}
      <Square {...props} color="green" size={20} />
    </View>
  );

  const square2 = (props: { tintColor?: string }) => (
    <Square {...props} color="red" size={20} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: square1,
      headerTitle: undefined,
      headerLeft: hasLeftItem ? square2 : undefined,
    });
  }, [navigation, hasLeftItem]);

  return (
    <View style={styles.container}>
      <Button
        title="Toggle subviews"
        onPress={() => setHasLeftItem(prev => !prev)}
      />
    </View>
  );
};

const SettingsScreen = ({
  navigation,
}: NativeStackScreenProps<SecondStackParamList>) => {
  return (
    <View style={styles.container}>
      <Button
        title={'Go to Info'}
        onPress={() => navigation.navigate('Info')}
      />
    </View>
  );
};

const FirstStack = createNativeStackNavigator<FirstStackParamList>();

const FirstStackNavigator = () => {
  return (
    <FirstStack.Navigator>
      <FirstStack.Screen
        name="Home"
        component={HomeScreen}
      />
      <FirstStack.Screen name="Details" component={DetailsScreen} />
    </FirstStack.Navigator>
  );
};

const SecondStack = createNativeStackNavigator<SecondStackParamList>();

const SecondStackNavigator = () => {
  return (
    <SecondStack.Navigator>
      <SecondStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerLeft: () => <Square size={16} />,
        }}
      />
      <SecondStack.Screen name="Info" component={InfoScreen} />
    </SecondStack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();



export function BottomTabNavigator() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="First" component={FirstStackNavigator} />
        <Tabs.Screen name="Second" component={SecondStackNavigator} />
      </Tabs.Navigator>
  );
}

const RootStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Root"
          component={BottomTabNavigator}
          options={{ headerShown: false }}
          />
        </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

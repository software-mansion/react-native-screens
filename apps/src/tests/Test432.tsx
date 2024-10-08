import { View, Button, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Square } from '../shared';

type StackParamList = {
  Home: undefined;
  Details: undefined;
  Settings: undefined;
  Info: undefined;
};

type StackScreenProps<T extends keyof StackParamList> = NativeStackScreenProps<
  StackParamList,
  T
>;

const HomeScreen = ({ navigation }: StackScreenProps<'Home'>) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title={'Go to details'}
        onPress={() => navigation.navigate('Details')}
      />
      <Button
        title={'Go to info'}
        onPress={() => navigation.navigate('Info')}
      />
      <Button
        title={'Show settings'}
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  );
};

const DetailsScreen = ({ navigation }: StackScreenProps<'Details'>) => {
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

const SettingsScreen = () => {
  return <Text>Settings</Text>;
};

const InfoScreen = ({ navigation }: StackScreenProps<'Info'>) => {
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
    <Button
      title="Toggle subviews"
      onPress={() => setHasLeftItem(prev => !prev)}
    />
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerRight: () => <Square size={20} color="black" />,
        }}
      />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen
        name="Info"
        component={InfoScreen}
        options={{
          headerTintColor: 'hotpink',
        }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
          headerRight: () => <Square size={30} />,
        }}
      />
    </Stack.Navigator>
  );
};

const Tabs = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tabs.Navigator screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="First" component={StackNavigator} />
        <Tabs.Screen name="Second" component={StackNavigator} />
      </Tabs.Navigator>
    </NavigationContainer>
  );
}

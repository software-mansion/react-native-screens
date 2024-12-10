import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeStackScreenProps, createNativeStackNavigator } from '@react-navigation/native-stack';

type StackParamList = {
  Home: undefined;
  NestedStack: undefined;
  MainStackScreen: undefined;
  MainStackScreen2: undefined;
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
};


function HomeScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Navigate to Screen 1"
        onPress={() => navigation.navigate('NestedStack')}
      />
      <Button
        title="Navigate to Screen (same stack)"
        onPress={() => navigation.navigate('MainStackScreen')}
      />
    </View>
  );
}

function MainStackScreen({ navigation }: NativeStackScreenProps<StackParamList, 'MainStackScreen'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Main stack screen</Text>
      <Button
        title="Go to second modal"
        onPress={() => navigation.navigate('MainStackScreen2')}
      />
      <Button
        title="goBack"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function MainStackScreen2({ navigation }: NativeStackScreenProps<StackParamList, 'MainStackScreen2'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Main stack screen 2</Text>
      <Button
        title="goBack"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

function Screen1({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Screen1'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 1</Text>
      <Button
        title="Navigate to Screen 2"
        onPress={() => navigation.navigate('Screen2')}
      />
    </View>
  );
}

function Screen2({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Screen2'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 2</Text>
      <Button
        title="Navigate to MainStackScreen - WORKS fine"
        onPress={() => navigation.navigate('MainStackScreen')}
      />
      <Button
        title="Navigate to Screen 3"
        onPress={() => navigation.navigate('Screen3')}
      />
    </View>
  );
}

function Screen3({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Screen3'>) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Screen 3</Text>
      <Button
        title="Navigate to MainStackScreen - NOT working"
        onPress={() => navigation.navigate('MainStackScreen')}
      />
      <Button
        title="Navigate to Screen 2"
        onPress={() => navigation.navigate('Screen2')}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator<StackParamList>();
const NestedStack = createNativeStackNavigator<StackParamList>();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NestedStack" component={NestedStackScreen} options={{ headerShown: true, presentation: 'modal' }} />
      <Stack.Screen name="MainStackScreen" component={MainStackScreen} options={{ headerShown: true, presentation: 'modal' }} />
      <Stack.Screen name="MainStackScreen2" component={MainStackScreen2} options={{ headerShown: true, presentation: 'modal' }} />
    </Stack.Navigator>
  );
}

function NestedStackScreen() {
  return (
    <NestedStack.Navigator screenOptions={{ presentation: 'modal' }}>
      <NestedStack.Screen name="Screen1" component={Screen1} />
      <NestedStack.Screen name="Screen2" component={Screen2} />
      <NestedStack.Screen name="Screen3" component={Screen3} />
    </NestedStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStack />
    </NavigationContainer>
  );
}

import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text } from 'react-native';

type StackRouteParamList = {
  First: undefined;
  Second: undefined;
  Replacement: undefined;
};

type StackNavigationProp = {
  navigation: NativeStackNavigationProp<StackRouteParamList & ParamListBase>;
};

const Stack = createNativeStackNavigator<StackRouteParamList>();

function HeaderButton({ title }: { title: string }) {
  return <Button title={title} onPress={() => {}} />;
}

function InfoButton() {
  return <HeaderButton title="Info" />;
}

function EditButton() {
  return <HeaderButton title="Edit" />;
}

function CloseButton() {
  return <HeaderButton title="Close" />;
}

function DoneButton() {
  return <HeaderButton title="Done" />;
}

function First({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Text>
        Every screen uses animation: 'none'. The header items must change in the
        same frame as the screen, without a cross-fade or a glass morph.
      </Text>
      <Button onPress={() => navigation.push('Second')} title="Push Second" />
      <Button
        onPress={() => navigation.replace('Replacement')}
        title="Replace with Replacement"
      />
    </ScrollView>
  );
}

function Second({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button onPress={() => navigation.pop()} title="Pop" />
      <Button
        onPress={() => navigation.replace('Replacement')}
        title="Replace with Replacement"
      />
    </ScrollView>
  );
}

function Replacement({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        onPress={() => navigation.replace('First')}
        title="Replace with First"
      />
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: 'none' }}>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            headerRight: InfoButton,
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerRight: EditButton,
          }}
        />
        <Stack.Screen
          name="Replacement"
          component={Replacement}
          options={{
            headerLeft: CloseButton,
            headerRight: DoneButton,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

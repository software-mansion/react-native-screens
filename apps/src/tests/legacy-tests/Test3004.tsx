import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View, ScrollView } from 'react-native';
import Colors from '../../shared/styling/Colors';

type StackRouteParamList = {
  First: undefined;
  Second: undefined;
  Third: undefined;
  Replacement: undefined;
  Modal: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function First({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => navigation.preload('Second')} title='Preload Second'/>
        <Button onPress={() => navigation.push('Second')} title='Go to Second'/>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => navigation.preload('Third')} title='Preload Third'/>
        <Button onPress={() => navigation.push('Third')} title='Go to Third'/>
      </View>
      <Button onPress={() => navigation.push('Modal')} title='Modal'/>
      <Button onPress={() => navigation.replace('Modal')} title='Replace Modal'/>
      <Button onPress={() => navigation.pop()} title='Pop'/>
      <Button onPress={() => navigation.popToTop()} title='Pop all'/>
    </ScrollView>
  )
}

function Second({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => navigation.preload('First')} title='Preload First'/>
        <Button onPress={() => navigation.push('First')} title='Go to First'/>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => navigation.preload('Third')} title='Preload Third'/>
        <Button onPress={() => navigation.push('Third')} title='Go to Third'/>
      </View>
      <Button onPress={() => navigation.replace('Replacement')} title='Replace'/>
      <Button onPress={() => navigation.pop()} title='Pop'/>
      <Button onPress={() => navigation.popToTop()} title='Pop all'/>
    </ScrollView>
  )
}

function Third({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior='automatic'>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => navigation.preload('First')} title='Preload First'/>
        <Button onPress={() => navigation.push('First')} title='Go to First'/>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Button onPress={() => navigation.preload('Second')} title='Preload Second'/>
        <Button onPress={() => navigation.push('Second')} title='Go to Second'/>
      </View>
      <Button onPress={() => navigation.replace('Replacement')} title='Replace'/>
      <Button onPress={() => navigation.pop()} title='Pop'/>
      <Button onPress={() => navigation.popToTop()} title='Pop all'/>
    </ScrollView>
  )
}

function Modal({ navigation }: StackNavigationProp) {
  return (
    <View style={{
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.NavyLightTransparent
    }}>
      <Button onPress={() => navigation.pop()} title='Go Back'/>
    </View>
  )
}

function Replacement({ navigation }: StackNavigationProp) {
  return (
    <View style={{ backgroundColor: Colors.NavyLight60 }}>
      <Text style={{ fontSize: 20, color: 'white' }}>Replacement</Text>
      <Button onPress={() => navigation.pop()} title='Pop'/>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} options={{
          animation: 'slide_from_right'
        }}/>
        <Stack.Screen name="Second" component={Second} options={{
          animation: 'slide_from_bottom'
        }}/>
        <Stack.Screen name="Third" component={Third} options={{
          animation: 'slide_from_left'
        }}/>
        <Stack.Screen name="Replacement" component={Replacement} options={{
          animation: 'fade',
        }}/>
        <Stack.Screen name="Modal" component={Modal} options={{
          presentation: 'transparentModal',
          animation: 'none'
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

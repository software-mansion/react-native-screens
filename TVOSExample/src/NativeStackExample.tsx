import React from 'react';
import 'react-native/tvos-types.d';
import {View, Text, Button} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {STYLES} from './styles';

function Root({navigation}) {
  return (
    <View style={[STYLES.screenContainer, {backgroundColor: '#CCC'}]}>
      <Button title="First" onPress={() => navigation.navigate('First')} />
      <Button title="Second" onPress={() => navigation.navigate('Second')} />
      <Button title="Third" onPress={() => navigation.navigate('Third')} />
    </View>
  );
}

function First({navigation}) {
  return (
    <View style={[STYLES.screenContainer, {backgroundColor: '#DDD'}]}>
      <Text>First</Text>
      <Button title="Second" onPress={() => navigation.navigate('Second')} />
      <Button title="Third" onPress={() => navigation.navigate('Third')} />
    </View>
  );
}

function Second({navigation}) {
  return (
    <View style={[STYLES.screenContainer, {backgroundColor: '#EEE'}]}>
      <Text>Second</Text>
      <Button title="Third" onPress={() => navigation.navigate('Third')} />
    </View>
  );
}

function Third() {
  return (
    <View style={[STYLES.screenContainer, {backgroundColor: '#FFF'}]}>
      <Text>Third</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

export default function NativeStackExample() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={Root} />
      <Stack.Screen name="First" component={First} />
      <Stack.Screen name="Second" component={Second} />
      <Stack.Screen name="Third" component={Third} />
    </Stack.Navigator>
  );
}

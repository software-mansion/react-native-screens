import React from 'react';
import {View, Text, Button} from 'react-native';

import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

const First = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) => (
  <View style={{flex: 1, justifyContent: 'center'}}>
    <Text style={{paddingBottom: 24, textAlign: 'center'}}>Screen 1</Text>
    <Button
      title="PUSH TO SCREEN 2"
      onPress={() => navigation.push('Screen2')}
    />
  </View>
);

const Second = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) => (
  <View style={{flex: 1, justifyContent: 'center'}}>
    <Text style={{paddingBottom: 24, textAlign: 'center'}}>Screen 2</Text>
    <Button
      title="PUSH TO SCREEN 3"
      onPress={() => navigation.push('Screen3')}
    />
  </View>
);

const Third = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) => (
  <View style={{flex: 1, justifyContent: 'center'}}>
    <Text style={{paddingBottom: 24, textAlign: 'center'}}>Screen 3</Text>
    <Button
      title="RESET TO SCREEN 1 WITH INDEX OF 0"
      onPress={() =>
        navigation.reset({
          routes: [{name: 'Screen1'}],
          index: 0,
        })
      }
    />
  </View>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackAnimation: 'slide_from_right',
        }}>
        <Stack.Screen name="Screen1" component={First} />
        <Stack.Screen name="Screen2" component={Second} />
        <Stack.Screen name="Screen3" component={Third} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

import {NavigationContainer} from '@react-navigation/native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';

import React from 'react';
import {Button, View} from 'react-native';

const Stack = createNativeStackNavigator();

const Screen1 = ({navigation}) => (
  <View style={{flex: 1}}>
    <Button onPress={() => navigation.navigate('Screen2')} title="Next" />
  </View>
);

const Screen2 = ({navigation}) => (
  <View style={{flex: 1}}>
    <Button onPress={() => navigation.navigate('Screen3')} title="Next" />
  </View>
);

const Screen3 = ({navigation}) => (
  <View style={{flex: 1}}>
    <Button onPress={() => navigation.navigate('Screen4')} title="Next" />
  </View>
);

const Screen4 = () => <View style={{flex: 1}} />;

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen component={Screen1} name="Screen1" />
        <Stack.Screen
          component={Screen2}
          name="Screen2"
          options={{
            headerBackTitleVisible: false,
            headerBackTitle: 'Custom title in back button menu',
          }}
        />
        <Stack.Screen
          component={Screen3}
          name="Screen3"
          options={{
            headerBackTitle: 'Small title',
            headerBackTitleStyle: {fontSize: 8},
          }}
        />
        <Stack.Screen
          component={Screen4}
          name="Screen4"
          options={{
            headerBackTitle: 'Custom title',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

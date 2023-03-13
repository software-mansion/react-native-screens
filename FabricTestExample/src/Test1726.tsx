import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Button, View} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const RootStack = createNativeStackNavigator();

const Screen1 = ({navigation: {navigate}}) => (
  <View style={{flex: 1}}>
    <Button onPress={() => navigate('Screen2')} title="Screen 2" />
  </View>
);

const Screen2 = ({navigation: {navigate}}) => (
  <View style={{flex: 1}}>
    <Button onPress={() => navigate('Screen3')} title="Screen 3" />
  </View>
);

const Screen3 = () => <View style={{flex: 1}} />;

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator>
        <RootStack.Screen component={Screen1} name="Screen1" />
        <RootStack.Screen
          component={Screen2}
          name="Screen2"
          options={{
            headerBackTitle: 'Custom title',
          }}
        />
        <RootStack.Screen
          component={Screen3}
          name="Screen3"
          options={{
            headerBackTitle: 'Small title',
            headerBackTitleStyle: {fontSize: 8},
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;

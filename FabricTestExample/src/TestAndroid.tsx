import React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

function First(props) {
  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Text>First screen</Text>
      <Button
        title="Navigate to the second screen"
        onPress={() => props.navigation.navigate('Second')}
      />
    </View>
  );
}

function Second(props) {
  return (
    <View style={{flex: 1, backgroundColor: 'green'}}>
      <Text>Second screen</Text>
    </View>
  );
}

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="First">
      <Stack.Screen component={First} name="First" options={{}} />
      <Stack.Screen component={Second} name="Second" options={{}} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;

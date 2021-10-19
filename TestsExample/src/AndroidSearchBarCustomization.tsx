import * as React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            searchBar: {
              autoCapitalize: 'sentences',
              textColor: '#FF00FF',
              barTintColor: '#00FF00',
              placeholder: 'Test...',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First() {
  return <View style={{flex: 1, backgroundColor: '#FFF'}}></View>;
}

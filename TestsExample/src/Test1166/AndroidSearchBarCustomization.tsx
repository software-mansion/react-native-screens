import * as React from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
  );
}

function First() {
  return <View style={{flex: 1, backgroundColor: '#FFF'}}></View>;
}

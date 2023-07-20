import * as React from 'react';
import { Button, View } from 'react-native';
import { ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

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

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFF' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

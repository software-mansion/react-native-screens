import React from 'react';
import { Button, SafeAreaView } from 'react-native';

import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

interface Props {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const App = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            stackPresentation: 'containedTransparentModal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const First = ({ navigation }: Props) => (
  <SafeAreaView>
    <Button
      title="Go to second screen"
      onPress={() => navigation.navigate('Second')}
    />
  </SafeAreaView>
);

const Second = ({ navigation }: Props) => (
  <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </SafeAreaView>
);

export default App;

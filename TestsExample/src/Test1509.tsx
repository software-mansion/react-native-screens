import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import * as React from 'react';
import {Button, Text, View} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>First Screen</Text>
      <Button
        title="Go to second"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

function Second() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'tomato',
      }}>
      <Text>Second Screen</Text>
      <Text>Swipe vertically</Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={
            {
              // currently it only works when you also set this prop on the previous screen
              // swipeDirection: 'vertical',
            }
          }
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            swipeDirection: 'vertical',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

import React from 'react';
import {Button, requireNativeComponent, View} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

let CustomView = requireNativeComponent('CustomView');

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View
      collapsable={false}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
      <CustomView
        style={{
          width: 100,
          height: 100,
        }}
      />
    </View>
  );
}

function DetailsScreen() {
  const navigation = useNavigation();
  return (
    <View
      collapsable={false}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Button title="Go to Home" onPress={() => navigation.goBack()} />
      <CustomView
        style={{
          width: 100,
          height: 100,
        }}
      />
    </View>
  );
}

export default function TestApp() {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
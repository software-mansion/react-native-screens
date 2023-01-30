/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {View, Text, Button} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
// import {
//   createNativeStackNavigator,
//   NativeStackNavigationProp,
// } from '@react-navigation/native-stack';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

function HomeScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  React.useEffect(() => {
    console.log('home mount');
    const unsubscribe = [
      navigation.addListener('focus', () => console.log('home is in focus')),
      navigation.addListener('blur', () => console.log('home is blurred')),
    ];
    return () => {
      console.log('home unmount');
      unsubscribe.forEach((item) => item());
    };
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  React.useEffect(() => {
    console.log('details mount');
    const unsubscribe = [
      navigation.addListener('focus', () => console.log('details is in focus')),
      navigation.addListener('blur', () => console.log('details is blurred')),
    ];
    return () => {
      console.log('details unmount');
      unsubscribe.forEach((item) => item());
    };
  }, []);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Details Screen</Text>
      <Button title="Go to Home" onPress={() => navigation.pop()} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

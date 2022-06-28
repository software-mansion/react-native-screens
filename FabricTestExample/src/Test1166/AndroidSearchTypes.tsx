import * as React from 'react';
import {Button, View} from 'react-native';
import {ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator screenOptions={{stackAnimation: 'none'}}>
      <Stack.Screen name="First" component={First} />
      <Stack.Screen
        name="number"
        component={Second}
        options={{searchBar: {autoFocus: true, inputType: 'number'}}}
      />
      <Stack.Screen
        name="email"
        component={Second}
        options={{searchBar: {autoFocus: true, inputType: 'email'}}}
      />
      <Stack.Screen
        name="phone"
        component={Second}
        options={{searchBar: {autoFocus: true, inputType: 'phone'}}}
      />
    </Stack.Navigator>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  React.useLayoutEffect(() => {
    function HeaderSearchButtons() {
      return (
        <View style={{flexDirection: 'row'}}>
          <Button title="N" onPress={() => navigation.navigate('number')} />
          <Button title="E" onPress={() => navigation.navigate('email')} />
          <Button title="P" onPress={() => navigation.navigate('phone')} />
        </View>
      );
    }
    navigation.setOptions({
      title: 'Home',
      headerRight: HeaderSearchButtons,
      stackAnimation: 'none',
    });
  }, [navigation]);
  return (
    <View style={{flex: 1, backgroundColor: '#FFF', padding: 12}}>
      <Button title="Number" onPress={() => navigation.navigate('number')} />
      <Button title="Email" onPress={() => navigation.navigate('email')} />
      <Button title="Phone" onPress={() => navigation.navigate('phone')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{flex: 1, backgroundColor: '#FFF', padding: 12}}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

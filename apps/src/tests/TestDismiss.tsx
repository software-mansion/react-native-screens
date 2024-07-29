import * as React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, View, Text, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();

type BaseRouteProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

function FirstScreen({ navigation }: BaseRouteProps): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: 'lightgreen' }]}>
      <Button onPress={() => navigation.navigate('Second')} title='Navigate Second' />
      <Button onPress={() => navigation.navigate('NestedStack')} title='Navigate NestedStack' />
    </View>
  );
}

function SecondScreen({ navigation }: BaseRouteProps): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: 'indianred' }]}>
      <Button onPress={() => navigation.pop()} title='PopTo First' />
    </View>
  );
}

function NestedFirstScreen({ navigation }: BaseRouteProps): React.JSX.Element {
  return (
    <View style={[styles.container, { backgroundColor: 'lightgreen' }]}>
      <Button onPress={() => navigation.navigate('Second')} title='Navigate Second' />
      <Button onPress={() => navigation.pop()} title='Pop back' />
    </View>
  );
}


function NestedStackScreen({ navigation }: BaseRouteProps): React.JSX.Element {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name='NestedFirst' component={NestedFirstScreen} />
      <NestedStack.Screen name='Second' component={SecondScreen} />
    </NestedStack.Navigator>
  );
}


function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='First' component={FirstScreen} />
        <Stack.Screen name='Second' component={SecondScreen} />
        <Stack.Screen name='NestedStack' component={NestedStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

export default App;

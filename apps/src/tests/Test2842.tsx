import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { styles } from '../shared/styles';
import { Button, Text, View } from 'react-native';
import { Rectangle } from '../shared/Rectangle';
import PressableWithFeedback from '../shared/PressableWithFeedback';

interface StackParamList extends ParamListBase {
  Home: undefined;
  Modal: undefined;
}

interface StackNavigationProps {
  navigation: NativeStackNavigationProp<StackParamList>;
}

const Stack = createNativeStackNavigator<StackParamList>();

function Home({ navigation }: StackNavigationProps) {
  return (
    <View style={[styles.flexContainer, { backgroundColor: 'darkorange' }]}>
      <Text>Home</Text>
      <Button title="Open modal" onPress={() => navigation.navigate('Modal')} />
    </View>
  );
}

function Modal({ navigation }: StackNavigationProps) {
  return (
    <View style={[styles.flexContainer, { backgroundColor: 'lightblue' }]}>
      <Text>Modal</Text>
      <Button title="Close modal" onPress={() => navigation.pop()} />
    </View>
  );
}

function HeaderRight() {
  return (
    <PressableWithFeedback>
      <Rectangle width={128} height={36} color={'lightgreen'} style={{ borderRadius: 16 }} />
    </PressableWithFeedback>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{
          headerRight: HeaderRight,
        }} />
        <Stack.Screen name="Modal" component={Modal} options={{
          presentation: 'modal',
          headerRight: HeaderRight,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

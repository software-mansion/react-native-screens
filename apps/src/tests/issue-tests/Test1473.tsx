import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

type StackParamList = {
  First: undefined;
  Second: undefined;
  Modal: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function First({ navigation }: NativeStackScreenProps<StackParamList, 'First'>) {
  return (
    <View style={styles.container}>
      <Text>This is the first screen</Text>
      <Button
        onPress={() => navigation.navigate('Second')}
        title="Navigate to second screen"
      />
    </View>
  );
}

function Second({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Second'>) {
  return (
    <View style={styles.container}>
      <Text>This is the second screen</Text>
      <Button
        onPress={() => navigation.navigate('Modal')}
        title="Open modal"
      />
    </View>
  );
}

function Modal({ navigation }: NativeStackScreenProps<StackParamList, 'Modal'>) {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: 'rgba(0, 170, 0, 0.5)',
      }}>
      <Text>This is the modal</Text>
      <Button
        onPress={() => navigation.goBack()}
        title="Close the modal"
      />
    </View>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="First">
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            fullScreenGestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

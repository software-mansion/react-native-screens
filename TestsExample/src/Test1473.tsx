import React from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

function First(props) {
  return (
    <View style={styles.container}>
      <Text>This is the first screen</Text>
      <Button
        onPress={() => props.navigation.navigate('Second')}
        title="Navigate to second screen"
      />
    </View>
  );
}

function Second(props) {
  return (
    <View style={styles.container}>
      <Text>This is the second screen</Text>
      <Button
        onPress={() => props.navigation.navigate('Modal')}
        title="Open modal"
      />
    </View>
  );
}

function Modal(props) {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: 'rgba(0, 170, 0, 0.5)',
      }}>
      <Text>This is the modal</Text>
      <Button
        onPress={() => props.navigation.goBack()}
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
            fullScreenSwipeEnabled: true,
          }}
        />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{
            stackPresentation: 'modal',
            stackAnimation: 'slide_from_bottom',
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

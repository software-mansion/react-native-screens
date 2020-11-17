import React from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

function Home(props) {
  return (
    <View style={styles.container}>
      <Text>This is the homescreen!</Text>
      <Button
        onPress={() => props.navigation.navigate('Modal')}
        title="Open modal"
      />
    </View>
  );
}
function Modal(props) {
  return (
    <View style={styles.container}>
      <Text>This is the Modal!</Text>
      <Button onPress={() => props.navigation.goBack()} title="Go back" />
    </View>
  );
}

const Stack = createNativeStackNavigator();

export function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{
            stackPresentation: 'modal',
            gestureEnabled: false,
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

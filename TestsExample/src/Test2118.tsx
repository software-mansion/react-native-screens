import React, { useEffect } from 'react';
import { View, Text, Button, Pressable, StyleSheet, Alert } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const fill = { flex: 1 };

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('DetailsStack')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperCustom: {
    width: '100%',
    height: 100,
    marginHorizontal: 30,
    borderRadius: 10,
    margin: 10,
  },
  text: {
    fontSize: 20,
    color: 'black',
  },
});

function DetailsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {new Array(10).fill(0).map((_, i) => (
        <Pressable
          onPress={() => {
            Alert.alert('Pressed!');
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
            },
            styles.wrapperCustom,
          ]}>
          {({ pressed }) => (
            <Text style={styles.text}>{pressed ? 'Pressed!' : 'Press Me'}</Text>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const Stack = createNativeStackNavigator(); // <-- change to createStackNavigator to see a difference

function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ animation: 'slide_from_left' }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="DetailsStack" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default App;

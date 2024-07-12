import React from 'react';
import { View, Text, Button, Pressable, StyleSheet, Alert } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ animation: 'slide_from_left' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DetailsStack" component={DetailsScreen} />
        <Stack.Screen name="NestedStack" component={NestedStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function NestedStackScreen() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NSHome" component={HomeScreen} />
      <NestedStack.Screen name="NSDetailsStack" component={DetailsScreen} />
    </NestedStack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('DetailsStack')}
      />
      <Button
        title="Go to NestedStack"
        onPress={() => navigation.navigate('NestedStack')}
      />
      <Button
        title="Go to NestedStack Details"
        onPress={() => navigation.navigate('NSDetailsStack')}
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      {new Array(10).fill(0).map((_, i) => (
        <Pressable
          key={i.toString()}
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


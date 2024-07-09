import React from 'react';
import { NavigationContainer, NavigationContext, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, StyleSheet, Button, Pressable, Text } from 'react-native';

type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

const Stack = createNativeStackNavigator();

function FirstScreen({ navigation }: NavProp) {
  const navigateToSecond = () => {
    navigation.navigate('Second');
  };
  return (
    <View style={[styles.redbox, styles.centeredView]}>
      <Button title="Navigate to Second" onPress={navigateToSecond} />
      <PressableWithHitSlop />
    </View>
  );
}

function SecondScreen({ navigation }: NavProp) {
  const navigateToFirst = () => {
    navigation.navigate('First');
  };

  return (
    <View style={[styles.greenbox, styles.centeredView]}>
      <Button title="Navigate to First" onPress={navigateToFirst} />
    </View>
  );
}

function HeaderLeft() {
  const onPressCallback = () => {
    console.log('HeaderLeft onPressCallback invoked');
  };

  return (
    <Pressable style={[styles.bluebox]} hitSlop={12} onPress={onPressCallback}>
      <Text style={{ color: 'white' }}>Press me</Text>
    </Pressable>
  );
}

function PressableWithHitSlop() {
  const onPressCallback = () => {
    console.log('PressableWithHitSlop onPressCallback invoked');
  };

  return (
    <View
      style={{
        padding: 12,
        margin: -12,
        backgroundColor: 'yellow',
      }}>
      <Pressable
        style={[styles.greenbox]}
        hitSlop={12}
        onPress={onPressCallback}>
        <Text style={{ color: 'white' }}>Press me</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={FirstScreen}
          options={{
            headerLeft: () => HeaderLeft(),
            headerRight: () => PressableWithHitSlop(),
          }}
        />
        <Stack.Screen name="Second" component={SecondScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  redbox: {
    backgroundColor: 'red',
  },
  greenbox: {
    backgroundColor: 'green',
  },
  bluebox: {
    backgroundColor: 'blue',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

import * as React from 'react';
import { Button, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

type ScreenBaseProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'fade',
        }}>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            headerTitle: () => (
              <View
                style={[styles.container, { backgroundColor: 'goldenrod' }]}>
                <Text>Hello there!</Text>
              </View>
            ),
            headerLeft: () => (
              <Pressable
                style={[styles.container, { backgroundColor: 'lightblue' }]}
                onPressIn={() => console.log('does work')}>
                <Text>Left</Text>
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                style={[styles.container, { backgroundColor: 'lightblue' }]}
                onPress={() => console.log('doesnt work')}>
                <Text>Right</Text>
              </Pressable>
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }: ScreenBaseProps) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 3,
  },
});

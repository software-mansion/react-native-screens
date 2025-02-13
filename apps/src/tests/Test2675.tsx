import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
    </View>
  );
}

function HeaderTitle() {
  return (
    <View>
      <Text>Title</Text>
    </View>
  );
}

function HeaderRight() {
  return (
    <View>
      <Text>Right</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            statusBarTranslucent: true,
            statusBarStyle: 'dark',
            //headerTitle: HeaderTitle,
            //headerRight: HeaderRight,
            headerSearchBarOptions: {
              placeholder: 'Search...',
              onChangeText: (event) => {
                console.log('Search text:', event.nativeEvent.text);
              },
            },
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


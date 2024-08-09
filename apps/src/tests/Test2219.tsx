import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen"
          component={Screen}
          options={{
            headerRight: () => (
              <Pressable
                onPress={() => setCount(prev => prev + 1)}
                style={({ pressed }) => [
                  styles.pressable,
                  pressed && { backgroundColor: 'goldenrod' },
                ]}>
                <Text>Press (+)</Text>
              </Pressable>
            ),
            title: count.toString(),
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ navigation }) => ({
            title: 'Details',
            headerLeft: () => (
              <Button
                onPress={navigation.goBack}
                title="Back"
                color="#00cc00"
              />
            ),
            headerRight: () => (
              <Pressable
                onPress={() => {
                  console.log('doesnt work');
                  navigation.goBack();
                }}>
                <Text>Doesnt work</Text>
              </Pressable>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Screen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => navigation.navigate('Details')}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { backgroundColor: 'goldenrod' },
        ]}>
        <Text>Go to Details</Text>
      </Pressable>
    </View>
  );
}

function DetailsScreen() {
  let counter = React.useRef(0);

  return (
    <View style={{ ...styles.container, backgroundColor: 'beige' }}>
      <Pressable
        onPressIn={() => {
          counter.current += 1;
          console.log(`[${counter.current}] Details: onPressIn`);
        }}
        onPress={() => {
          console.log(`[${counter.current}] Details: onPress`);
          // navigation.goBack();
        }}
        onPressOut={() => {
          console.log(`[${counter.current}] Details: onPressOut`);
        }}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { backgroundColor: 'goldenrod' },
        ]}>
        <Text>Go back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pressable: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: 'red',
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});

export default App;

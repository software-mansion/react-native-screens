import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function App() {
  const [count, setCount] = React.useState(0);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ statusBarTranslucent: false }}>
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
            headerRight: () => (
              <Pressable
                onPress={navigation.goBack}
                style={({ pressed }) => [
                  styles.pressable,
                  pressed && { backgroundColor: 'goldenrod' },
                ]}>
                <Text>Go Back</Text>
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
        }}
        onPressOut={() => {
          console.log(`[${counter.current}] Details: onPressOut`);
        }}
        style={({ pressed }) => [
          styles.pressable,
          pressed && { backgroundColor: 'goldenrod' },
        ]}>
        <Text>Press me</Text>
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
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
});

export default App;

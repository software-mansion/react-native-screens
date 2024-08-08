import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button, StyleSheet, Pressable } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// const Stack = createStackNavigator();
const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={({ navigation }) => ({
            title: 'Details',
            headerLeft: () => (
              <Button
                onPress={() => navigation.goBack()}
                title="Back"
                color="#00cc00"
              />
            ),
            headerRight: () => (
              <Pressable onPress={() => { console.log("doesnt work"); navigation.goBack() }}>
                <Text>Doesnt work</Text>
              </Pressable>
            ),
            //headerMode: "screen",
            headerBackVisible: false,
            // headerLeft: () => (
            //   <Pressable onPressIn={() => { console.log("works"); navigation.goBack() }}><Text>works</Text></Pressable>
            // )
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
        // onPress={() => {}}
      />
    </View>
  );
}

function useCounter(initialValue: number) {
  const [value, setValue] = React.useState(initialValue);

  const incrementer = React.useCallback(() => {
    setValue(old => old + 1);
  }, [setValue]);

  return [value, incrementer];
}

function DetailsScreen({ navigation }) {
  let counter = React.useRef(0);
  const [color, setColor] = React.useState('lightblue');

  return (
    <View style={{ ...styles.container, backgroundColor: 'goldenrod' }}>
      <View>
        <Pressable
          onPressIn={() => {
            counter.current += 1;
            setColor('lightgreen');
            console.log(`[${counter.current}] Details: onPressIn`);
          }}
          onPress={() => {
            console.log(`[${counter.current}] Details: onPress`);
            // navigation.goBack();
          }}
          onPressOut={() => {
            setColor('lightblue');
            console.log(`[${counter.current}] Details: onPressOut`);
          }}
        >
          <View style={{ backgroundColor: color, width: 100, height: 30 }}>
            <Text>Go back</Text>
          </View>
        </Pressable>
      </View>
    </View>
  )
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;


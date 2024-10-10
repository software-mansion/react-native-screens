import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {
  BottomTabNavigationProp,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

function FirstTabScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<ParamListBase>;
}) {
  const [state, setState] = useState(false);

  console.log('[FIRST TAB] render');
  return (
    <View
      style={styles.container}
      onLayout={e => {
        console.log(
          '[FIRST TAB] screen onLayout layout:',
          e.nativeEvent.layout,
        );
        setState(!state);
      }}>
      <Text style={styles.title}>First Tab</Text>
      <Text style={styles.text}>
        Rotate device - only [FIRST TAB] logs should appear
      </Text>
      <Button
        title="Go to second tab"
        onPress={() => navigation.navigate('Second Tab')}
      />
    </View>
  );
}

function SecondTabScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<ParamListBase>;
}) {
  const [state, setState] = useState(false);

  console.log('[SECOND TAB] render');

  return (
    <View
      style={styles.container}
      onLayout={e => {
        console.log('[SECOND TAB] screen onLayout', e.nativeEvent.layout);
        setState(!state);
      }}>
      <Text style={styles.title}>Second Tab</Text>
      <Text style={styles.text}>
        Rotate device - only [SECOND TAB] logs should appear
      </Text>
      <Button
        title="Go to third tab"
        onPress={() => navigation.navigate('Third Tab')}
      />
      <Button title="Go back" onPress={navigation.goBack} />
    </View>
  );
}

function ThirdTabScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<ParamListBase>;
}) {
  const [state, setState] = useState(false);

  console.log('[THIRD TAB] render');

  return (
    <View
      style={styles.container}
      onLayout={e => {
        console.log('[THIRD TAB] screen onLayout', e.nativeEvent.layout);
        setState(!state);
      }}>
      <Text style={styles.title}>Third Tab</Text>
      <Text style={styles.text}>
        Rotate device - only [THIRD TAB] logs should appear
      </Text>
      <Button title="Go back" onPress={navigation.goBack} />
    </View>
  );
}

const store = new Set<Dispatch>();

type Dispatch = (value: number) => void;

function useValue() {
  const [value, setValue] = useState<number>(0); // integer state

  useEffect(() => {
    const dispatch = (value: number) => {
      setValue(value);
    };
    store.add(dispatch);
    return () => {
      store.delete(dispatch);
    };
  }, [setValue]);

  return value;
}

function StackScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const value = useValue();
  // only 1 'render' should appear at the time
  console.log('render', value);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stack Screen</Text>
      <Text style={styles.text}>
        Push more screens - only one 'render' should log at a time (max. 2 on
        fabric)
      </Text>
      <Button
        title="Push more screens"
        onPress={() => navigation.push('Screen')}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function StackNavigator() {
  useEffect(() => {
    let timer = 0;
    const interval = setInterval(() => {
      timer = timer + 1;
      store.forEach(dispatch => dispatch(timer));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Stack.Navigator screenOptions={{ freezeOnBlur: true }}>
      <Stack.Screen name="Screen" component={StackScreen} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ freezeOnBlur: true }}>
        <Tab.Screen name="First Tab" component={FirstTabScreen} />
        <Tab.Screen name="Second Tab" component={SecondTabScreen} />
        <Tab.Screen name="Third Tab" component={ThirdTabScreen} />
        <Tab.Screen
          name="Native Stack"
          component={StackNavigator}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  text: {
    textAlign: 'center',
    color: 'black',
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function TabScreen({ route }: { route: RouteProp<ParamListBase> }) {
  const [state, setState] = useState(false);
  const name = '[' + route.name.toUpperCase() + ']';
  console.log(name, 'render');

  return (
    <View
      style={styles.container}
      onLayout={e => {
        console.log(name, 'screen onLayout', e.nativeEvent.layout);
        setState(!state);
      }}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.text}>
        Rotate device - only "{name}" logs should appear
      </Text>
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
        <Tab.Screen name="First Tab" component={TabScreen} />
        <Tab.Screen name="Second Tab" component={TabScreen} />
        <Tab.Screen name="Third Tab" component={TabScreen} />
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

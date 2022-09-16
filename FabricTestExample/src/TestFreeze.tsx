import React, {useState, useEffect} from 'react';
import {View, Text, Button, ScrollView} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const store = new Set<Dispatch>();

type Dispatch = (value: number) => void;

function useValue() {
  const [value, setValue] = useState<number>(0); // integer state

  useEffect(() => {
    const dispatch = (value: number) => {
      setValue(value);
    };
    store.add(dispatch);
    return () => store.delete(dispatch);
  }, [setValue]);

  return value;
}

function HomeScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const value = useValue();
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen {value}</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}

function DetailsScreen({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const value = useValue();
  // only 1 'render' should appear at the time
  console.log('render', value);
  return (
    <ScrollView>
      <View style={{height: 400}} />
      <Text style={{alignSelf: 'center'}}>Details Screen {value}</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.push('Details')}
      />
      <View style={{height: 800}} />
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  useEffect(() => {
    let timer = 0;
    const interval = setInterval(() => {
      timer = timer + 1;
      store.forEach((dispatch) => dispatch(timer));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

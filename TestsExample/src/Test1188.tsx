import React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Nested" component={Nested} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Button
        title="Go to nested stack"
        onPress={() => navigation.navigate('Nested')}
      />
    </View>
  );
}

const Nested = () => (
  <NestedStack.Navigator>
    <NestedStack.Screen name="First" component={First} />
  </NestedStack.Navigator>
);

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  // using useLayoutEffect fixes the crash
  // React.useLayoutEffect(() => {
  React.useEffect(() => {
    navigation.setOptions({
      searchBar: {},
    });
  }, [navigation]);

  return <View />;
}

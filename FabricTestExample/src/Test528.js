import React, { useLayoutEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const CustomHeaderRight = () => {
  return (
    <Pressable
      onPress={() => Alert.alert('hi')}
      style={{ backgroundColor: 'orange' }}>
      <Text>Custom Button</Text>
    </Pressable>
  );
};
const Screen1 = props => {
  useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: () => <CustomHeaderRight />,
    });
  }, [props.navigation]);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'teal',
      }}>
      <Text>Screen 1</Text>
      <Pressable onPress={() => props.navigation.navigate('Screen2')}>
        <Text>Go to Screen 2</Text>
      </Pressable>
    </View>
  );
};
const Screen2 = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'pink',
      }}>
      <Text>Screen 2</Text>
    </View>
  );
};

const Stack = createNativeStackNavigator();
const Router = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Screen1" component={Screen1} />
      <Stack.Screen name="Screen2" component={Screen2} />
    </Stack.Navigator>
  );
};
const App = () => {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  );
};

export default App;

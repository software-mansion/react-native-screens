import React from 'react';
import { FlatList, Button, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

const List = () => {
  return (
    <FlatList
      renderItem={({ item }) => {
        return <Text key={item.toString()}>{item}</Text>;
      }}
      data={[1, 2, 3]}
    />
  );
};

const First = ({ navigation }: any) => (
  <>
    <List />
    <Button onPress={() => navigation.navigate('Second')} title="Navigate" />
  </>
);

const Second = ({ navigation }: any) => (
  <>
    <List />
    <Button onPress={navigation.goBack} title="Go back" />
  </>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

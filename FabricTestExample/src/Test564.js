import React from 'react';
import { ScrollView, Button } from 'react-native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeScreen({navigation}) {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic">
      <Button
        title="TabNavigator"
        onPress={() => navigation.navigate('TabNavigator')}
      />
    </ScrollView>
  );
};

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Tab1" component={HomeScreen} />
    <Tab.Screen name="Tab2" component={HomeScreen} />
    <Tab.Screen name="Tab3" component={HomeScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerTranslucent: true}}>
        <Stack.Screen name="Home1" component={HomeScreen} />
        <Stack.Screen name="TabNavigator" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

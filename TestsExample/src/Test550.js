import React from 'react';
import {Button, ScrollView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

function HomeScreen({navigation}) {
  return (
    <ScrollView contentContainerStyle={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Button
          onPress={() => navigation.navigate('Details')}
          title="Go to Details"
        />
    </ScrollView>
  );
}

function DetailsScreen() {
  return (
    <ScrollView />
  );
}

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        backButtonImage: require('../assets/backButton.png'),
        headerBackTitleVisible: false,
        headerTintColor: 'red',
      }}>
      <RootStack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
      <RootStack.Screen
        name="Details"
        component={DetailsScreen}
      />
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
}

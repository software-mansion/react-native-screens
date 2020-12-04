import React from 'react';
import {Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 24}}>Home screen with a 'bold' title</Text>
      <Button
        onPress={() => navigation.navigate('Details')}
        title="Go to Details"
      />
    </View>
  );
}

function DetailsScreen() {
  return (
    <View>
      <Text>Details screen with a 'thin' title</Text>
    </View>
  );
}

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerTitleStyle: {fontFamily: 'System', fontWeight: '900'},
      }}>
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{headerTitleStyle: {fontFamily: 'System', fontWeight: '100'}}}
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

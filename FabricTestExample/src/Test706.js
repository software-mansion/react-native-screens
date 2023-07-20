import React from 'react';
import { Button, Text, ScrollView, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

function HomeScreen({ navigation }) {
  return (
    <ScrollView>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 24 }}>Home screen with a 'bold' title</Text>
        <Button
          onPress={() => navigation.navigate('Details')}
          title="Go to Details"
        />
      </View>
    </ScrollView>
  );
}

function DetailsScreen() {
  return (
    <ScrollView>
      <View>
        <Text>Details screen with a 'light' title</Text>
      </View>
    </ScrollView>
  );
}

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        headerTitleStyle: { fontWeight: '900' },
        headerLargeTitle: true,
        headerLargeTitleStyle: {
          fontWeight: '900',
        },
      }}>
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          headerTitleStyle: { fontWeight: '100' },
          headerLargeTitleStyle: {
            fontWeight: '100',
          },
        }}
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

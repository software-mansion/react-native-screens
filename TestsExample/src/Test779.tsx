import React from 'react';
import { Button, ScrollView, View, SafeAreaView } from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

function HomeScreen({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  return (
    <SafeAreaView>
      <Button
        onPress={() => {
          navigation.navigate('Details');
        }}
        title="Go to details"
      />
    </SafeAreaView>
  );
}

function DetailsScreen({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  return (
    <ScrollView style={{ backgroundColor: 'red' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          title="Go back"
        />
        <Button
          onPress={() => {
            navigation.navigate('Profile');
          }}
          title="Go to profile"
        />
      </View>
    </ScrollView>
  );
}

function ProfileScreen({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) {
  return (
    <ScrollView style={{ backgroundColor: 'blue' }}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          onPress={() => {
            navigation.goBack();
          }}
          title="Go back"
        />
      </View>
    </ScrollView>
  );
}

const RootStack = createNativeStackNavigator();

function RootStackScreen() {
  return (
    <RootStack.Navigator
      screenOptions={{
        stackAnimation: 'slide_from_bottom',
        gestureEnabled: false,
        headerShown: false,
      }}>
      <RootStack.Screen name="Home" component={HomeScreen} />
      <RootStack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerShown: true }}
      />
      <RootStack.Screen name="Profile" component={ProfileScreen} />
    </RootStack.Navigator>
  );
}

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <RootStackScreen />
    </NavigationContainer>
  );
}

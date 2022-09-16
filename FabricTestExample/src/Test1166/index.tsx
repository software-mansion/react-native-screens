import React from 'react';
import {Button, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import AndroidDifferentScreenSearch from './AndroidDifferentScreenSearch';
import AndroidSearchBarCustomization from './AndroidSearchBarCustomization';
import AndroidSearchTypes from './AndroidSearchTypes';
import AndroidSearchBarEvents from './AndroidSearchBarEvents';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Customization"
          component={AndroidSearchBarCustomization}
        />
        <Stack.Screen name="InputTypes" component={AndroidSearchTypes} />
        <Stack.Screen name="Events" component={AndroidSearchBarEvents} />
        <Stack.Screen
          name="DifferentSearchScreen"
          component={AndroidDifferentScreenSearch}
        />
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
    <View
      style={{
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        padding: 12,
      }}>
      <View style={{marginBottom: 12}}>
        <Button
          title="Search bar customization"
          onPress={() => navigation.navigate('Customization')}
        />
      </View>
      <View style={{marginBottom: 12}}>
        <Button
          title="Search bar input types"
          onPress={() => navigation.navigate('InputTypes')}
        />
      </View>
      <View style={{marginBottom: 12}}>
        <Button
          title="Search bar events"
          onPress={() => navigation.navigate('Events')}
        />
      </View>
      <View style={{marginBottom: 12}}>
        <Button
          title="Search bar different search results screen"
          onPress={() => navigation.navigate('DifferentSearchScreen')}
        />
      </View>
    </View>
  );
}

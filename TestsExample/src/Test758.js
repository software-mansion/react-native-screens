import * as React from 'react';
import { Button, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import SearchBar from 'react-native-search-bar';

const AppStack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerLargeTitle: true,
          headerTranslucent: true,
          // eslint-disable-next-line react/display-name
          searchBar: () => <SearchBar
                              placeholder="Placeholder"
                              onChangeText={() => alert('changetext')}
                              onSearchButtonPress={() => alert('button press')}
                              onCancelButtonPress={() => alert('button cancel')}
                            />
        }}>
        <AppStack.Screen name="First" component={First} />
        <AppStack.Screen
          name="Second"
          component={Second}
        />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
    </ScrollView>
  );
}

function Second({navigation}) {
  return (
    <ScrollView>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </ScrollView>
  );
}

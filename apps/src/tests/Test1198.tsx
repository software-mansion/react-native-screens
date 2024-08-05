import React, { useEffect } from 'react';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';

const BottomTabs = createBottomTabNavigator();

function Home() {
  return (
    <View
      style={{
        backgroundColor: 'lightgrey',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Home</Text>
    </View>
  );
}

function Settings() {
  const isFocused = useIsFocused();
  const fetch = () => console.log('refetching data!');

  useEffect(() => {
    if (isFocused) {
      fetch();
    }
  }, [isFocused]);

  console.log({ isFocused });

  return (
    <View
      style={{
        backgroundColor: 'wheat',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>Settings</Text>
    </View>
  );
}

const App = () => (
  <NavigationContainer>
    <BottomTabs.Navigator>
      <BottomTabs.Screen name="Home" component={Home} />
      <BottomTabs.Screen name="Settings" component={Settings} />
    </BottomTabs.Navigator>
  </NavigationContainer>
);

export default App;

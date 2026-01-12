import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { styles } from '../../shared/styles';
import { View } from 'react-native';
import { Rectangle } from '../../shared/Rectangle';

const Stack = createNativeStackNavigator();

function Home() {
  return (
    <View style={[styles.flexContainer, { backgroundColor: 'darkorange' }]} />
  );
}

function HeaderRight() {
  return <Rectangle width={128} height={36} color={'darkblue'} />;
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerRight: HeaderRight,
            headerSearchBarOptions: {
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

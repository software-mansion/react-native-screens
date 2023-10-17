import React from 'react';
import { View } from 'react-native';
import {
  useHeaderHeight,
  createNativeStackNavigator,
} from 'react-native-screens/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const App = () => {
  const backgroundStyle = {
    backgroundColor: '#fafffe', // isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <View
      style={[
        backgroundStyle,
        {
          flex: 1,
        },
      ]}>
      <View
        style={{
          flex: 1,
          height: '100%',
        }}>
        <Navigation />
      </View>
    </View>
  );
};

const List = () => {
  const headerHeight = useHeaderHeight();

  return (
    <View style={{ flex: 1, backgroundColor: '#00fffa' }}>
      <View
        style={{
          backgroundColor: '#fffa00',
          position: 'absolute',
          top: headerHeight,
          width: 200,
          height: 100,
        }}
      />
    </View>
  );
};

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          fullScreenSwipeEnabled: true,
          stackAnimation: 'fade_from_bottom',
          customAnimationOnSwipe: true,
          // headerLargeTitle: true,
          headerTranslucent: true,
        }}>
        <Stack.Screen
          name="Header"
          component={List}
          options={{ statusBarStyle: 'dark' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

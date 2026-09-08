import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useHeaderHeight } from '@react-navigation/elements';
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
          fullScreenGestureEnabled: true,
          animation: 'fade_from_bottom',
          animationMatchesGesture: true,
          // headerLargeTitle: true,
          headerTransparent: true,
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

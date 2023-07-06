import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

const RootStack = createNativeStackNavigator();

const TestComponent = () => {
  return <Text>TestComponent</Text>;
};

const App = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerHideBackButton: true,
        }}>
        <RootStack.Screen
          name="Chapter"
          options={{
            title: 'Fabric Example',
            headerShown: false,
          }}
          initialParams={{
            index: 0,
            chapterRoute: 'Chapter',
            afterChapterRoute: 'HeaderDemo',
          }}
          component={TestComponent}
        />
        <RootStack.Screen
          name="HeaderDemo"
          component={TestComponent}
          options={{title: 'Header Demo'}}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default App;

/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Button, View } from 'react-native';
import {
  NavigationContainer,
  ParamListBase,
  getFocusedRouteNameFromRoute,
  Route,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

function isTranslucent(route: Route<string>) {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Screen1';

  switch (routeName) {
    case 'Screen1':
      console.log('screen1');
      return false;
    case 'Screen2':
      console.log('screen2');
      return true;
  }
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => (
  <Tab.Navigator screenOptions={{}}>
    <Tab.Screen name="Screen1" component={TabScreen} />
    <Tab.Screen name="Screen2" component={TabScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen
          name="Tab"
          component={TabNavigator}
          options={({ route }) => ({
            headerStyle: { backgroundColor: 'transparent' },
            headerTranslucent: isTranslucent(route),
          })}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{ headerStyle: { backgroundColor: 'transparent' } }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{ backgroundColor: '#FFF', flex: 1 }}>
      <Button
        title="Tap me for tab navigator"
        onPress={() => navigation.navigate('Tab')}
      />
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

function TabScreen() {
  return (
    <View style={{ backgroundColor: '#CCC', flex: 1, paddingTop: 200 }}>
      <View style={{ backgroundColor: '#EEE', flex: 1 }} />
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  const [isTranslucent, setIsTranslucent] = React.useState(false);

  React.useEffect(() => {
    navigation.setOptions({ headerTranslucent: isTranslucent });
  }, [isTranslucent]);

  return (
    <View style={{ backgroundColor: '#DDD', flex: 1, paddingTop: 200 }}>
      <View style={{ backgroundColor: '#333', flex: 1 }}>
        <Button
          title="Change translucent"
          onPress={() => setIsTranslucent(prev => !prev)}
        />
      </View>
    </View>
  );
}

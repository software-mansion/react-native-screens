import React, { useEffect, useState } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View } from 'react-native';

type RouteParamList = {
  Home: undefined;
  FormSheet: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: StackNavigationProp) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Open FormSheet"
        onPress={() => navigation.navigate('FormSheet')}
        testID="home-button-open-formsheet"
      />
    </View>
  );
}

function FormSheet({ navigation }: StackNavigationProp) {
  const [extended, setExtended] = useState(false);
  const [intervalEnabled, setIntervalEnabled] = useState(true);

  useEffect(() => {
    if (!intervalEnabled) {
      return;
    }

    const intervalHandle = setInterval(() => {
      setExtended(!extended);
    }, 2000);

    return () => clearInterval(intervalHandle);
  }, [extended, intervalEnabled]);

  return (
    <View>
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button title="Toggle automatic toggling" onPress={() => setIntervalEnabled(old => !old)} />
      <View
        style={{
          height: 200,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Every 2 seconds, sheet's height should change.</Text>
      </View>
      {extended && (
        <View
          style={{
            height: 200,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'lightgreen',
          }}>
          <Text>Like this.</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="FormSheet"
          component={FormSheet}
          options={{
            headerShown: false,
            presentation: 'formSheet',
            sheetAllowedDetents: 'fitToContents',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

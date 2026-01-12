import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

type RouteParams = {
  Home: undefined;
  DynamicHeader: undefined;
};

type NavigationProps = {
  navigation: NativeStackNavigationProp<RouteParams>;
};

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: NavigationProps) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button
        title="Navigate DynamicHeaderScreen"
        onPress={() => navigation.navigate('DynamicHeader')}
      />
    </View>
  );
}

function DynamicHeaderScreen({ navigation }: NavigationProps) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
    });
  }, [navigation]);

  React.useEffect(() => {
    const timerId = setTimeout(() => {
      navigation.setOptions({
        headerLeft: HeaderLeft,
        headerRight: HeaderLeft,
      });
    }, 1300);

    return () => {
      clearTimeout(timerId);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text>DynamicHeaderScreen</Text>
      <Button title="Go back" onPress={() => navigation.popTo('Home')} />
    </View>
  );
}

function HeaderLeft() {
  return (
    <View>
      <Text>Left</Text>
    </View>
  );
}

function HeaderTitle() {
  return (
    <View>
      <Text>Title</Text>
    </View>
  );
}

function HeaderRight() {
  return (
    <View>
      <Text>Right</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            // statusBarTranslucent: true, // This prop has been deprecated.
            statusBarStyle: 'dark',
            //headerTitle: HeaderTitle,
            //headerRight: HeaderRight,
            headerSearchBarOptions: {
              placeholder: 'Search...',
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
              onChangeText: event => {
                console.log('Search text:', event.nativeEvent.text);
              },
            },
          }}
        />
        <Stack.Screen
          name="DynamicHeader"
          component={DynamicHeaderScreen}
          options={{
            // statusBarTranslucent: true, // This prop has been deprecated.
            statusBarStyle: 'dark',
            headerTitle: HeaderTitle,
            headerSearchBarOptions: {
              placeholder: 'Search...',
              // Added in https://github.com/software-mansion/react-native-screens/pull/3186
              // to preserve test's original search bar configuration.
              placement: 'stacked',
              hideWhenScrolling: false,
              onChangeText: event => {
                console.log('Search text:', event.nativeEvent.text);
              },
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

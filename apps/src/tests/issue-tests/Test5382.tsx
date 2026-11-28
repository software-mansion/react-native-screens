import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Colors } from '@apps/shared/styling';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5382
//
// Launch the app with an RTL app language, e.g.
// `xcrun simctl launch booted <bundle-id> -AppleLanguages "(he)"`, or set the
// app's language to Hebrew in iOS Settings. The navigation container pins the
// direction to 'ltr', so every header gets `direction: 'ltr'`.
// Expected: Details' back button and title sit on the left, and swipe-back
// starts from the left edge.
// Bug: the header lays out right-to-left and swipe-back starts from the right
// edge, because 'ltr' equals the prop's default and is never applied natively.

type StackParamList = {
  Home: undefined;
  Details: undefined;
};

const Stack = createNativeStackNavigator<StackParamList>();

function Home({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'Home'>;
}) {
  return (
    <View style={styles.container}>
      <Text>Launch with an RTL app language, then open Details.</Text>
      <Button
        title="Open Details"
        onPress={() => navigation.navigate('Details')}
        testID="home-open-details"
      />
    </View>
  );
}

function Details() {
  return (
    <View style={styles.container}>
      <Text>The back button and title should be on the left.</Text>
    </View>
  );
}

export default function Test5382() {
  return (
    <NavigationContainer direction="ltr">
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={Details} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: Colors.White,
  },
});

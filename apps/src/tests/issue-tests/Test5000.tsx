import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button } from '@apps/shared';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5000
//
// iOS 26+. `Home` has no header and `Detail` has one, so the navigation bar is
// shown along with the push of `Detail` and hidden along with the pop.
//
// The bar should move together with `Detail`. Before the fix it trails the
// screen: the red bar is not aligned with the left edge of the gray screen
// while they slide, and on the push it shows up only after the screen has
// covered a part of the way.
//
// `Detail` mounts its rows while the transition is running, as a screen of
// a real application does. The busier the main thread, the further the bar
// trails.

const ROW_COUNT = 300;

type ParamList = {
  Home: undefined;
  Detail: undefined;
};

function HomeScreen({ navigation }: NativeStackScreenProps<ParamList, 'Home'>) {
  return (
    <View style={styles.home}>
      <Text style={styles.text}>
        Push Detail and watch the red navigation bar: it should slide in and out
        aligned with the gray screen and it should not move after the screen has
        settled.
      </Text>
      <Button
        title="Push Detail"
        testID="test5000-push-detail"
        onPress={() => navigation.navigate('Detail')}
      />
    </View>
  );
}

function DetailScreen() {
  return (
    <ScrollView
      style={styles.detail}
      contentInsetAdjustmentBehavior="automatic">
      {Array.from({ length: ROW_COUNT }, (_, index) => (
        <Text key={index} style={styles.row}>
          Row {index + 1}
        </Text>
      ))}
    </ScrollView>
  );
}

const Stack = createNativeStackNavigator<ParamList>();

export default function Test5000() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            title: 'Detail',
            headerBackButtonDisplayMode: 'minimal',
            headerStyle: { backgroundColor: '#d32f2f' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
    gap: 16,
  },
  text: {
    fontSize: 16,
  },
  detail: {
    flex: 1,
    backgroundColor: '#9e9e9e',
  },
  row: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

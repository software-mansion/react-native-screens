import * as React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

type SimpleStackParams = {
  First: undefined;
  Second: undefined;
};

const HeaderTitle = () => (
  <Text>
    React Native Screens Examples Very Long Title That Should Get Truncated
  </Text>
);

const Left = () => <Text style={{ backgroundColor: '#00F' }}>Left</Text>;
const Right = () => <Text style={{ backgroundColor: '#F00' }}>Right</Text>;

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          animation: 'simple_push',
          headerLeft: Left,
          headerRight: Right,
        }}>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            title:
              'React Native Screens Examples Very Long Title That Should Get Truncated',
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{ headerTitle: HeaderTitle }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>;
}) {
  return (
    <View style={styles.container}>
      <Text>This is a screen with title</Text>
      <Button
        title="Tap me for screen with headerTitle"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>;
}) {
  return (
    <View style={styles.container}>
      <Text>This is a screen with headerTitle</Text>
      <Button
        title="Tap me for screen with title"
        onPress={() => navigation.popTo('First')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

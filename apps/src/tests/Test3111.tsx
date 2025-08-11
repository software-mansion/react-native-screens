import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, View, Text, ScrollView } from 'react-native';
import PressableWithFeedback from '../shared/PressableWithFeedback';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
  Screen4: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

export function LongText() {
  return (
    <Text>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce sed egestas
      felis. Proin laoreet eros a tellus elementum, quis euismod enim gravida.
      Morbi at arcu commodo, condimentum purus a, congue sapien. Nunc luctus
      molestie enim ut mattis. Pellentesque sollicitudin, arcu nec sodales
      gravida, tortor mauris dignissim urna, nec venenatis nibh ex ut odio.
      Donec rhoncus arcu eu pulvinar cursus. Sed id ullamcorper erat. Proin
      mollis a mi vitae posuere. Integer a pretium tellus, vel faucibus metus.
    </Text>
  );
}

function Screen1({ navigation }: StackNavigationProp) {
  return (
    <View>
      <Button
        title="Go to screen 2"
        onPress={() => navigation.push('Screen2')}
      />
      <Button
        title="Go to screen 3"
        onPress={() => navigation.push('Screen3')}
      />
      <Button
        title="Go to screen 4"
        onPress={() => navigation.push('Screen4')}
      />
      <LongText />
    </View>
  );
}

function Screen2() {
  return (
    <View style={{ gap: 20, paddingHorizontal: 30, paddingVertical: 10 }}>
      {[...Array(30).keys()].map(index => (
        <PressableWithFeedback
          key={index + 1}
          onPress={() => console.log(`Pressed #${index + 1}`)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text>Pressable #{index + 1}</Text>
        </PressableWithFeedback>
      ))}
    </View>
  );
}

function Screen3() {
  return (
    <ScrollView
      contentContainerStyle={{
        gap: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
      }}>
      {[...Array(30).keys()].map(index => (
        <PressableWithFeedback
          key={index + 1}
          onPress={() => console.log(`Pressed #${index + 1}`)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text>Pressable #{index + 1}</Text>
        </PressableWithFeedback>
      ))}
    </ScrollView>
  );
}

function Screen4() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        gap: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
      }}>
      {[...Array(30).keys()].map(index => (
        <PressableWithFeedback
          key={index + 1}
          onPress={() => console.log(`Pressed #${index + 1}`)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}>
          <Text>Pressable #{index + 1}</Text>
        </PressableWithFeedback>
      ))}
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerRight: () => (
            <PressableWithFeedback
              onPress={() => console.log('Pressed headerRight')}>
              <Text>Pressable</Text>
            </PressableWithFeedback>
          ),
        }}>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={
            {
              // presentation: 'modal',
            }
          }
        />
        <Stack.Screen
          name="Screen3"
          component={Screen3}
          options={{
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="Screen4"
          component={Screen4}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

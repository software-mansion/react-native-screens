import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ParamListBase,
} from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Image, ScrollView, Text, useColorScheme } from 'react-native';
import { HeaderBackButton } from '@react-navigation/elements';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Screen1({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Go to screen 2"
        onPress={() => navigation.push('Screen2')}
      />
      <Text style={{ padding: 20 }}>
        Go to the second screen and observe left bar button item. Arrow image
        should appear immediately during the push animation, without any
        transition from native back button/liquid glass effect. For more details
        and video, refer to PR with the same number as this test screen.
      </Text>
    </ScrollView>
  );
}

function Screen2({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Go to screen 3"
        onPress={() => navigation.push('Screen3')}
      />
      <Button title="Go back" onPress={() => navigation.pop()} />
    </ScrollView>
  );
}

function Screen3({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button title="Go back" onPress={() => navigation.pop()} />
    </ScrollView>
  );
}

const backImage = _ => (
  <Image
    source={require('../../../assets/backButton.png')} // can be regular view instead of image
    style={{ width: 40, height: 40 }}
  />
);

export default function App() {
  const colorScheme = useColorScheme();
  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={({ navigation }) => ({
            unstable_headerLeftItems: () => [
              {
                type: 'custom',
                element: (
                  <HeaderBackButton
                    onPress={() => {
                      navigation.goBack();
                    }}
                    backImage={backImage}
                  />
                ),
                hidesSharedBackground: true,
              },
            ],
          })}
        />
        <Stack.Screen name="Screen3" component={Screen3} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import * as React from 'react';
import { Button, View, Text, ScrollView } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={Home}
          options={{ headerTitle: 'Home' }}
        />
        <Stack.Screen
          name="screenA"
          component={ScreenA}
          options={{ headerShown: false, animation: 'slide_from_bottom', fullScreenGestureEnabled: true, gestureDirection: 'vertical' }}
        />
        <Stack.Screen
          name="screenB"
          component={ScreenB}
          options={{ headerShown: false, animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const Home = ({ navigation }: NavProp) => (
  <View style={{ flex: 1, alignItems: 'center', paddingTop: 50 }}>
    <Text>Home</Text>
    <Button
      onPress={() => navigation.navigate('screenA')}
      title="Go to dismissable screen"
    />
    <Button
      onPress={() => navigation.navigate('screenB')}
      title="Go to undismissable screen"
    />
  </View>
);

const ScreenA = ({ }: NavProp) => (
  <ScrollView contentContainerStyle={{ flex: 1 }}>
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Dismissable screen</Text>
    </View>
  </ScrollView>
);

const ScreenB = ({ navigation }: NavProp) => (
  <ScrollView contentContainerStyle={{ flex: 1 }}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Undismissable screen</Text>
      <Button
        onPress={() => navigation.goBack()}
        title="Back"
      />
    </View>
  </ScrollView>
);

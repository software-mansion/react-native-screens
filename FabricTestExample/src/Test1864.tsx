import * as React from 'react';
import { Button, View, Text } from 'react-native';
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
          name="screenA"
          component={ScreenA}
          options={{ headerTitle: 'screen a title', headerShown: false }}
        />
        <Stack.Screen
          name="screenB"
          component={ScreenB}
          options={{ headerTitle: 'screen b title' }}
        />
        <Stack.Screen
          name="screenC"
          component={ScreenC}
          options={{ headerTitle: 'screen c title', headerShown: false }}
        />
        <Stack.Screen
          name="screenD"
          component={ScreenD}
          options={{ headerTitle: 'screen d title' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const ScreenA = ({ navigation }: NavProp) => (
  <View style={{ flex: 1, paddingTop: 50 }}>
    <Text>Screen A</Text>
    <Button
      onPress={() => navigation.navigate('screenB')}
      title="Go to screen B"
    />
  </View>
);

const ScreenB = ({ navigation }: NavProp) => (
  <View style={{ flex: 1 }}>
    <Text>Screen B</Text>
    <Button
      onPress={() => navigation.navigate('screenC')}
      title="Go to screen C"
    />
  </View>
);

const ScreenC = ({ navigation }: NavProp) => (
  <View style={{ flex: 1, paddingTop: 50 }}>
    <Text>Screen C</Text>
    <Button
      onPress={() => navigation.navigate('screenD')}
      title="Go to screen D"
    />
  </View>
);

const ScreenD = (_props: NavProp) => (
  <View style={{ flex: 1 }}>
    <Text>Screen D</Text>
  </View>
);

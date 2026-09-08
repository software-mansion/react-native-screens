import { NavigationContainer, RouteProp } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
// import { NativeStackNavigationProp, createNativeStackNavigator } from "react-native-screens/native-stack";
import React from 'react';
import { Button, TextInput, View } from 'react-native';

type RouteParamList = {
  Home: undefined;
  Second: undefined;
  FormSheet: undefined;
  Modal: undefined;
  NestedStackHost: undefined;
};

type RouteProps<RouteName extends keyof RouteParamList> = {
  navigation: NativeStackNavigationProp<RouteParamList, RouteName>;
  route: RouteProp<RouteParamList, RouteName>;
};

const Stack = createNativeStackNavigator<RouteParamList>();
// const Stack = createNativeStackNavigator();

function Home({ navigation }: RouteProps<'Home'>): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightsalmon', gap: 12 }}>
      <View style={{ marginTop: 12 }}>
        <Button
          title="Go Second"
          onPress={() => navigation.navigate('Second')}
        />
      </View>
      <View>
        <Button
          title="Go FormSheet"
          onPress={() => navigation.navigate('FormSheet')}
        />
      </View>
      <View>
        <Button title="Go Modal" onPress={() => navigation.navigate('Modal')} />
      </View>
    </View>
  );
}

function Second({ navigation }: RouteProps<'Second'>): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen', gap: 12 }}>
      <View style={{ marginTop: 12 }}>
        <Button title="Go Home" onPress={() => navigation.popTo('Home')} />
      </View>
      <View style={{}}>
        <Button
          title="Go FormSheet"
          onPress={() => navigation.navigate('FormSheet')}
        />
      </View>
    </View>
  );
}

function FormSheet({
  navigation,
}: RouteProps<'FormSheet'> | RouteProps<'Modal'>): React.JSX.Element {
  return (
    <View style={{ backgroundColor: 'lightgreen' }}>
      <View style={{ marginVertical: 12 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput
          style={{
            marginVertical: 12,
            paddingVertical: 8,
            backgroundColor: 'lavender',
            borderRadius: 24,
            width: '80%',
          }}
          placeholder="Trigger keyboard..."></TextInput>
      </View>
      <View
        style={{ backgroundColor: 'lightcoral', height: 500, width: '100%' }}
      />
    </View>
  );
}

function Modal({ navigation }: RouteProps<'Modal'>): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
      <View style={{ marginVertical: 12 }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
      <View style={{ alignItems: 'center' }}>
        <TextInput
          style={{
            marginVertical: 12,
            paddingVertical: 8,
            backgroundColor: 'lavender',
            borderRadius: 24,
            width: '80%',
          }}
          placeholder="Trigger keyboard..."
        />
      </View>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={
          {
            // statusBarTranslucent: false, // This prop has been deprecated.
          }
        }>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="FormSheet"
          component={FormSheet}
          options={{
            presentation: 'formSheet',
            //sheetAllowedDetents: [0.5, 0.7, 0.9],
            sheetAllowedDetents: 'fitToContents',
            sheetLargestUndimmedDetentIndex: 'none',
            contentStyle: {
              backgroundColor: 'lightgreen',
            },
          }}
        />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{
            presentation: 'modal',
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

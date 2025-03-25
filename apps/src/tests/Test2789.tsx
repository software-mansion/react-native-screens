import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, View } from 'react-native';

type NavigationRouteProps<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
}

type RootStackRouteParamList = {
  RootStackHome: undefined;
};

type OneStackRouteParamList = RootStackRouteParamList & {
  OneHome: undefined;
}

type TwoStackRouteParamList = OneStackRouteParamList & {
  TwoHome: undefined;
  TwoSecond: undefined;
  TwoSheet: undefined;
}

type RootStackRouteNavProps = NavigationRouteProps<RootStackRouteParamList>;
type TwoStackRouteNavProps = NavigationRouteProps<TwoStackRouteParamList>;


const RootStack = createNativeStackNavigator<RootStackRouteParamList>();
const TwoStack = createNativeStackNavigator<TwoStackRouteParamList>();

function RootStackHostComponent() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="RootStackHome" component={RootStackHome} />
    </RootStack.Navigator>
  );
}

function RootStackHome({ }: RootStackRouteNavProps) {
  return (
    <TwoStackHostComponent />
  );
}

function TwoStackHostComponent() {
  return (
    <TwoStack.Navigator>
      <TwoStack.Screen name="TwoHome" component={TwoStackHome} />
      <TwoStack.Screen name="TwoSecond" component={TwoStackSecond} />
      <TwoStack.Screen name="TwoSheet" component={TwoStackSheet} options={{
        presentation: 'formSheet',
        sheetAllowedDetents: 'fitToContents',
      }} />
    </TwoStack.Navigator>
  );
}

function TwoStackHome({ navigation }: TwoStackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'palevioletred' }}>
      <Button title="Open TwoSheet" onPress={() => navigation.navigate('TwoSheet')} />
      <Button title="Open TwoSecond" onPress={() => navigation.navigate('TwoSecond')} />
    </View>
  );
}

function TwoStackSecond({ navigation }: TwoStackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'tomato' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function TwoStackSheet({ navigation }: TwoStackRouteNavProps) {
  return (
    <View style={{ flex: undefined, backgroundColor: 'palegreen' }}>
      <View style={{ backgroundColor: 'peru', height: 400 }}>
        <Button title="Open TwoSecond" onPress={() => navigation.navigate('TwoSecond')} />
      </View>
    </View>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <RootStackHostComponent />
    </NavigationContainer>
  );
}

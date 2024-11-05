import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, ScrollView, Text, View } from "react-native";


type RouteParamList = {
  Home: undefined;
  Sheet: undefined;
  ReproSheet: undefined;
}

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: { navigation: NativeStackNavigationProp<RouteParamList> }): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
      <Button title="Open Sheet" onPress={() => navigation.navigate('Sheet')} />
      <Button title="Open reproduction sheet" onPress={() => navigation.navigate('ReproSheet')} />
    </View>

  )
}

function Sheet(): React.JSX.Element {
  return (
    <View style={{backgroundColor: 'crimson', flex: 1 }} collapsable={false} >
      <ScrollView style={{ flex: 1 }}>
        {Array.from({ length: 90 }).map((_, index) => (<Text key={index}>I'm a long scrollview</Text>))}
        <View style={{ width: '100%', height: 50, backgroundColor: 'seagreen' }} />
      </ScrollView>
    </View>
  )
}

function SheetFromReproduction(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }} >
      <ScrollView style={{ flex: 1 }}>
        <Text>Modal Screen</Text>
        <View style={{ height: 2000, backgroundColor: 'red' }}>
          {Array.from({ length: 100 }).map((_, index) => (
            <Text key={index}>I'm a long scrollview</Text>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name='Sheet' component={Sheet} options={{
          presentation: 'formSheet',
          headerShown: true,
          sheetAllowedDetents: [0.5, 0.9],
          unstable_screenStyle: {
            backgroundColor: 'crimson'
          }
        }} />
        <Stack.Screen name='ReproSheet' component={SheetFromReproduction} options={{
          presentation: 'formSheet',
          headerShown: true,
          sheetAllowedDetents: [0.9],
          unstable_screenStyle: {
            backgroundColor: 'crimson'
          }
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

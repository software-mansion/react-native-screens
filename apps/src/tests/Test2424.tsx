import { NavigationContainer } from "@react-navigation/native";
import { NativeStackNavigationProp, createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, ScrollView, Text, View } from "react-native";


type RouteParamList = {
  Home: undefined;
  Sheet: undefined;
}

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: { navigation: NativeStackNavigationProp<RouteParamList> }): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
      <Button title="Open Sheet" onPress={() => navigation.navigate('Sheet')} />
    </View>

  )
}

function Sheet(): React.JSX.Element {
  return (
    <View style={{backgroundColor: 'crimson' }} collapsable={false} >
      <ScrollView>
        {Array.from({ length: 90 }).map((_, index) => (<Text key={index}>I'm a long scrollview</Text>))}
        <View style={{ width: '100%', height: 50, backgroundColor: 'seagreen' }} />
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
          headerShown: false,
          sheetAllowedDetents: [0.5, 1.0],
          unstable_screenStyle: {
            backgroundColor: 'crimson'
          }
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Dimensions, ScrollView, Text, View } from "react-native";

function ScrollViewTemplate() {
  const emoji = ['😎', '🍏', '👀', '🤖', '👾', '👨‍💻'];
  console.log(`ScrollViewRender screen dimensions / width ${Dimensions.get('screen').width} / height ${Dimensions.get('screen').height}`);
  console.log(`ScrollViewRender window dimensions / width ${Dimensions.get('window').width} / height ${Dimensions.get('window').height}`);

  return (
    <ScrollView>
      <Text style={{ fontSize: 21 }}>
        {Array.from({ length: 50000 }).map(_ => emoji[Math.floor(Math.random() * emoji.length)])}
      </Text>
    </ScrollView>
  );
}

function Foo() {
  return (
    <View style={{ backgroundColor: 'red', flex: 1 }}></View>
  )
}

export default function() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        autoHideHomeIndicator: true,
      }}>
        <Stack.Screen name="Test" component={ScrollViewTemplate}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
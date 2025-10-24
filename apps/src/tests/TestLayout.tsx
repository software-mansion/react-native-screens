import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Button, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <StackComponent />
    </NavigationContainer>
  )
}

function StackComponent() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="GreenModal" component={GreenScreen} options={{
        presentation: 'modal'
      }} />
    </Stack.Navigator>
  )
}

function Home({ navigation }) {
  const showModalAction = React.useCallback(() => {
    navigation.navigate('GreenModal');
  }, [navigation]);


  return (
    <View style={{ flex: 1 }}>
      <Text>Hello world</Text>
      <Button title="Show modal" onPress={showModalAction} />
    </View>
  );
}

function ModalContent() {
  return (
    <View style={{ flex: 1 }}>
      <Text>Hello world from modal</Text>
    </View>
  );
}

function Counter() {
  const [count, setCount] = React.useState(0);

  const counterAction = React.useCallback(() => {
    setCount(v => v + 1);
  }, []);

  return (
    <Pressable onPress={counterAction}>
      <Text>{`Counter: ${count}`}</Text>
    </Pressable>
  )
}

export function GreenScreen() {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <Pressable>
          <Text>Green / Modal </Text>
        </Pressable>
        <Counter />
        <View style={{ flex: 1, width: 50, backgroundColor: "green" }} />
        <View style={{ height: 50, width: "100%", backgroundColor: "darkgreen" }} />
      </View>
    </>
  );
}

export function GreenModal() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      {/* <Pressable onPress={() => router.dismiss()}> */}
      {/*   <Text>dismiss()</Text> */}
      {/* </Pressable> */}
      {/* <Pressable onPress={() => router.dismissAll()}> */}
      {/*   <Text>dismissAll()</Text> */}
      {/* </Pressable> */}
      {/* <Pressable onPress={() => router.dismissTo("/blue")}> */}
      {/*   <Text>dismissTo("/blue")</Text> */}
      {/* </Pressable> */}
      {/* <Pressable onPress={() => router.dismissTo("/red")}> */}
      {/*   <Text>dismissTo("/red")</Text> */}
      {/* </Pressable> */}
      <View style={{ flex: 1, width: 50, backgroundColor: "green" }} />
      <View style={{ height: 50, width: "100%", backgroundColor: "darkgreen" }} />
    </View>
  );
}

export default function App() {
  return (
    <Navigation />
  );
}

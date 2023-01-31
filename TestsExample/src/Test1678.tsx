import * as React from 'react';
import { Button, Text } from 'react-native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {atom, useAtom} from "jotai";

const RootNavigator = createNativeStackNavigator()

const authAtom = atom(null)

const Onboarding = () => {
  const navigation = useNavigation();

  return (
    <>
      <Text>
        Onboarding
      </Text>
      <Button title="Open Modal" onPress={() => {
        navigation.navigate("Modal");
      }} />
    </>
    )
}

const AppScreen = () => {
  return <Text>App</Text>
}

const Modal = () => {
  // const [, setToken] = React.useState(true);
  const [, setToken] = useAtom(authAtom)
  return (
    <>
      <Text>
        Modal
      </Text>
      <Button title="Log In" onPress={() => {
        setToken(true);
      }} />
    </>
    )
}

export default function App() {
  // const [token] = React.useState(false);
  const [token, setToken] = useAtom(authAtom);
  return (
    <NavigationContainer>
      <RootNavigator.Navigator>
        {!token ?
          <RootNavigator.Screen
            name="Onboarding"
            component={Onboarding}
            />
        :
          <RootNavigator.Screen
          name="App"
          component={AppScreen}
          />
        }
        {/* <RootNavigator.Group
        screenOptions={{presentation: "modal"}}
        > */}
          <RootNavigator.Screen
            name="Modal"
            options={{
              presentation: 'modal'
            }}
            component={Modal}
            />
        {/* </RootNavigator.Group> */}
      </RootNavigator.Navigator>
    </NavigationContainer>
  );
}

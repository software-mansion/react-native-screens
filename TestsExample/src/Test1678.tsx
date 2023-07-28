import * as React from 'react';
import { Button, Text } from 'react-native';
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
// import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { atom, useAtom } from 'jotai';
import { Screen, ScreenStack } from 'react-native-screens';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const loggedInAtom = atom(false);

const Onboarding = ({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) => {
  // const [_, _] = useAtom(loggedInAtom);

  return (
    <>
      <Text>Onboarding</Text>
      <Button
        title="Open Modal"
        onPress={() => {
          navigation.navigate('Modal');
          // navigation(true)
        }}
      />
    </>
  );
};

const AppScreen = () => {
  return <Text>Main App Screen</Text>;
};

const Modal = () => {
  const [_, setLoggedIn] = useAtom(loggedInAtom);
  return (
    <>
      <Text>Modal</Text>
      <Button
        title="Log In"
        onPress={() => {
          setLoggedIn(true);
        }}
      />
    </>
  );
};

export function App2() {
  const [isLoggedIn, _] = useAtom(loggedInAtom);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="App" key="App-key" component={AppScreen} />
        ) : (
          <Stack.Screen
            name="Onboarding"
            key="Onboarding-key"
            component={Onboarding}
          />
        )}
        <Stack.Screen
          name="Modal"
          key="Modal-key"
          component={Modal}
          options={{
            stackPresentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export function App() {
  const [token, _] = useAtom(loggedInAtom);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const children = [];
  if (token) {
    children.push(
      <Screen key="AppScreen">
        <AppScreen />
      </Screen>,
    );
  } else {
    children.push(
      <Screen key="Onboarding">
        <Onboarding navigation={setModalOpen} />
      </Screen>,
    );
  }

  if (isModalOpen) {
    children.push(
      <Screen key="Modal" stackPresentation="modal">
        <Modal />
      </Screen>,
    );
  }
  return (
    <ScreenStack
      style={{
        flex: 1,
        marginTop: 200,
      }}>
      {children}
    </ScreenStack>
  );
}

export default App2;

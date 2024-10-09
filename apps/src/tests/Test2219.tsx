import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { Pressable, PressableProps, StyleSheet, Text, View } from "react-native";

type StackParamList = {
  Home: undefined,
}

type RouteProps = {
  navigation: NativeStackNavigationProp<StackParamList>;
}

type PressableState = 'pressed-in' | 'pressed' | 'pressed-out'


const Stack = createNativeStackNavigator<StackParamList>();


function PressableWithFeedback(props: PressableProps): React.JSX.Element {
  const [pressedState, setPressedState] = React.useState<PressableState>('pressed-out');

  const onPressInCallback = React.useCallback(() => {
    console.log('Pressable onPressIn');
    setPressedState('pressed-in');
  }, []);

  const onPressCallback = React.useCallback(() => {
    console.log('Pressable onPress');
    setPressedState('pressed');
  }, []);

  const onPressOutCallback = React.useCallback(() => {
    console.log('Pressable onPressOut');
    setPressedState('pressed-out');
  }, []);

  const contentsStyle = pressedState === 'pressed-out'
    ? styles.pressablePressedOut
    : (pressedState === 'pressed'
      ? styles.pressablePressed
      : styles.pressablePressedIn);

  return (
    <View style={contentsStyle}>
      <Pressable
        onPressIn={onPressInCallback}
        onPress={onPressCallback}
        onPressOut={onPressOutCallback}
      >
        {props.children}
      </Pressable>
    </View>

  );
}

function HeaderTitle(): React.JSX.Element {
  return (
    <PressableWithFeedback
      onPressIn={() => console.log('Pressable onPressIn')}
      onPress={() => console.log('Pressable onPress')}
      onPressOut={() => console.log('Pressable onPressOut')}
    >
      <View style={{ height: 200, width: 80, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ alignItems: 'center' }}>Regular Pressable</Text>
      </View>
    </PressableWithFeedback>
  )
}

function Home(_: RouteProps): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'seagreen' }}>
      <View style={{ flex: 1, alignItems: 'center', marginTop: 48 }}>
        <PressableWithFeedback
          onPressIn={() => console.log('Pressable onPressIn')}
          onPress={() => console.log('Pressable onPress')}
          onPressOut={() => console.log('Pressable onPressOut')}
        >
          <View style={{ height: 40, width: 200, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ alignItems: 'center' }}>Regular Pressable</Text>
          </View>
        </PressableWithFeedback>
      </View>
    </View>
  );
}

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerTitle: HeaderTitle,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  pressablePressedIn: {
    backgroundColor: 'lightsalmon',
  },
  pressablePressed: {
    backgroundColor: 'crimson',
  },
  pressablePressedOut: {
    backgroundColor: 'lightseagreen',
  }
});


export default App;

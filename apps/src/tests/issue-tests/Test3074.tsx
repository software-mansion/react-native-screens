import React, { useEffect, useRef } from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, Text, View, Animated, useAnimatedValue } from 'react-native';
import Colors from '../../shared/styling/Colors';
import { useTransitionProgress } from 'react-native-screens';

type StackRouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  TModal1: undefined;
  TModal2: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();

function makeScreen(route: keyof StackRouteParamList, navigateTo: keyof StackRouteParamList | undefined, color: string, uiOffset: number) {
  return function Screen({ navigation }: StackNavigationProp) {
    const { progress: animatedProgress, closing: animatedClosing, goingForward: animatedGoingForward } = useTransitionProgress();

    const progress = animatedProgress.interpolate({ inputRange: [0, 1], outputRange: [1, 200] });
    const closing = animatedClosing.interpolate({ inputRange: [0, 1], outputRange: [1, 200] });
    const goingForward = animatedGoingForward.interpolate({ inputRange: [0, 1], outputRange: [1, 200] });

    animatedProgress.addListener(v => console.log(`progress ${route} = ${Math.round(v.value * 100) / 100}`));
    animatedClosing.addListener(v => console.log(`closing ${route} = ${v.value}`));
    animatedGoingForward.addListener(v => console.log(`goingForward ${route} = ${v.value}`));

    const spinValue = useAnimatedValue(0);
    useEffect(() => {
      Animated.loop(Animated.timing(spinValue, { toValue: 1, duration: 1000, useNativeDriver: true })).start();
    }, []);
    const spin = spinValue.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    return (
      <>
        <View style={{ position: 'absolute', marginTop: uiOffset ? uiOffset : 4, width: '100%', height: 100, backgroundColor: color }}>
          {navigateTo != null && <Button title={"Go to " + navigateTo} onPress={() => navigation.navigate(navigateTo)} />}
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
        <View style={{ position: 'absolute', marginTop: uiOffset ? uiOffset : 4 }}>
          <Text>Progress: </Text><Animated.View style={{ height: 10, width: 1, backgroundColor: Colors.RedDark100, transform: [{ scaleX: progress }] }} />
          <Text>Closing: </Text><Animated.View style={{ height: 10, width: 1, backgroundColor: Colors.GreenDark100, transform: [{ scaleX: closing }] }} />
          <Text>Going Forward: </Text><Animated.View style={{ height: 10, width: 1, backgroundColor: Colors.NavyDark100, transform: [{ scaleX: goingForward }] }} />
        </View>
        <View style={{ position: 'absolute', marginTop: (uiOffset ? uiOffset : 4) + 40, marginLeft: 300 }}>
          <Animated.View style={{ position: 'absolute', backgroundColor: Colors.YellowDark100, transform: [{ rotate: spin }] }}><Text>freeze{"\n"}check</Text></Animated.View>
        </View>
      </>
    )
  }
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          autoHideHomeIndicator: true,
        }}>
          <Stack.Group>
            <Stack.Screen name="Screen1" component={makeScreen("Screen1", "Screen2", Colors.BlueLight40, 0)} options={{ animation: "fade" }} />
            <Stack.Screen name="Screen2" component={makeScreen("Screen2", "TModal1", Colors.BlueLight60, 80)} options={{ animation: "fade", animationDuration: 3000 }} />
          </Stack.Group>
          <Stack.Group screenOptions={{
            presentation: "transparentModal",
          }}>
            <Stack.Screen name="TModal1" component={makeScreen("TModal1", "TModal2", Colors.BlueLight80, 160)} options={{ animation: "fade", animationDuration: 3000 }} />
            <Stack.Screen name="TModal2" component={makeScreen("TModal2", undefined, Colors.BlueLight100, 240)} options={{ animation: "none" }} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      <Text style={{ position: 'absolute', marginTop: 450 }}>
        The stack above consists of 2 screens and 2 transparent fullscreen modals.
        When all of them are pushed on stack, Screen1 covers Screen2, and Screen2 is visible below both modals.
        Notice the difference in transitions when clicking "Go Back", using header back button, and swiping.
        {"\n\n"}
        When using "Go back", screens will not be responsive, because React removes it before host is finished. Use back button to see the progress. Modals can only be dismissed using "Go Back",
        so use logs to observe the changes.
      </Text>
    </>
  );
}

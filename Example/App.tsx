import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, Dimensions } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import Animated, {
  AnimatedScreenTransition,
  Easing,
} from 'react-native-reanimated';
import { GestureDetectorProvider } from 'react-native-screens/gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type StackParamList = {
  Main: undefined;
  ScreenA: undefined;
  ScreenB: undefined;
  ScreenC: undefined;
  ScreenD: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenA'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
  <View style={styles.container}>
    <Text style={[styles.header, {}]}>Screen Transitions</Text>
    <View style={styles.row}>
      <Animated.View
        style={[styles.box, styles.boxA]}
        sharedTransitionTag="screenA">
        <Pressable
          onPress={() => navigation.navigate('ScreenA')}
          style={styles.pressable}>
          <Animated.Text
            style={styles.label}
            sharedTransitionTag="screenA-label">
            Swipe UP
          </Animated.Text>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[styles.box, styles.boxB]}
        sharedTransitionTag="screenB">
        <Pressable
          onPress={() => navigation.navigate('ScreenB')}
          style={styles.pressable}>
          <Animated.Text
            style={styles.label}
            sharedTransitionTag="screenB-label">
            Swipe RIGHT
          </Animated.Text>
        </Pressable>
      </Animated.View>
    </View>
    <View style={styles.row}>
      <Animated.View
        style={[styles.box, styles.boxC]}
        sharedTransitionTag="screenC">
        <Pressable
          onPress={() => navigation.navigate('ScreenC')}
          style={styles.pressable}>
          <Animated.Text
            style={styles.label}
            sharedTransitionTag="screenC-label">
            Swipe DOWN
          </Animated.Text>
        </Pressable>
      </Animated.View>
      <Animated.View
        style={[styles.box, styles.boxD]}
        sharedTransitionTag="screenD">
        <Pressable
          onPress={() => navigation.navigate('ScreenD')}
          style={styles.pressable}>
          <Animated.Text
            style={styles.label}
            sharedTransitionTag="screenD-label">
            Swipe LEFT
          </Animated.Text>
        </Pressable>
      </Animated.View>
    </View>
  </View>
);

const ScreenA = (): JSX.Element => {
  const [tag, setTag] = React.useState('screenA');

  useEffect(() => {
    setTag('');
    return () => {
      setTag('screenA');
    };
  });

  return (
    <Animated.View
      style={[styles.screen, styles.boxA]}
      sharedTransitionTag={tag}>
      <Animated.Text
        style={styles.label}
        sharedTransitionTag={tag && `${tag}-label`}>
        Swipe UP
      </Animated.Text>
    </Animated.View>
  );
};

const ScreenB = (): JSX.Element => {
  const [tag, setTag] = React.useState('screenB');

  useEffect(() => {
    setTag('');
    return () => {
      setTag('screenB');
    };
  });

  return (
    <Animated.View
      style={[styles.screen, styles.boxB]}
      sharedTransitionTag={tag}>
      <Animated.Text
        style={styles.label}
        sharedTransitionTag={tag && `${tag}-label`}>
        Swipe RIGHT
      </Animated.Text>
    </Animated.View>
  );
};

const ScreenC = (): JSX.Element => {
  const [tag, setTag] = React.useState('screenC');

  useEffect(() => {
    setTag('');
    return () => {
      setTag('screenC');
    };
  });

  return (
    <Animated.View
      style={[styles.screen, styles.boxC]}
      sharedTransitionTag={tag}>
      <Animated.Text
        style={styles.label}
        sharedTransitionTag={tag && `${tag}-label`}>
        Swipe DOWN
      </Animated.Text>
    </Animated.View>
  );
};

const ScreenD = (): JSX.Element => {
  const [tag, setTag] = React.useState('screenD');

  useEffect(() => {
    setTag('');
    return () => {
      setTag('screenD');
    };
  });

  return (
    <Animated.View
      style={[styles.screen, styles.boxD]}
      sharedTransitionTag={tag}>
      <Animated.Text
        style={styles.label}
        sharedTransitionTag={tag && `${tag}-label`}>
        Swipe LEFT
      </Animated.Text>
    </Animated.View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const SwipeUp: AnimatedScreenTransition = {
  topScreenFrame: event => {
    'worklet';
    return {
      transform: [{ translateY: event.translationY }],
    };
  },
  belowTopScreenFrame: (event, screenSize) => {
    'worklet';
    const progress = Math.abs(event.translationY / screenSize.height);
    return {
      transform: [{ scale: 0.7 + 0.3 * progress }],
    };
  },
};

const SwipeRight: AnimatedScreenTransition = {
  topScreenFrame: (event, screenSize) => {
    'worklet';
    const progress = Math.abs(event.translationX / screenSize.width);

    return {
      transform: [
        { translateX: event.translationX },
        { rotate: 20 * progress + 'deg' },
      ],
      opacity: Easing.out(Easing.ease)(1 - progress),
    };
  },
  belowTopScreenFrame: (event, screenSize) => {
    'worklet';
    const progress = Math.abs(event.translationX / screenSize.width);
    return {
      transform: [{ rotate: `${progress * 360}deg` }],
    };
  },
};

const SwipeLeft: AnimatedScreenTransition = {
  topScreenFrame: (event, screenSize) => {
    'worklet';
    const progress = Math.abs(event.translationX / screenSize.width);

    return {
      transform: [
        { translateX: event.translationX },
        { rotate: -20 * progress + 'deg' },
      ],
      opacity: Easing.out(Easing.ease)(1 - progress),
    };
  },
  belowTopScreenFrame: () => {
    'worklet';
    return {};
  },
};

const App = (): JSX.Element => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <GestureDetectorProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            // headerLargeTitle: true,
            stackAnimation: 'fade',
            statusBarStyle: 'light',
          }}>
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen
            name="ScreenA"
            component={ScreenA}
            options={{
              transitionAnimation: SwipeUp,
              goBackGesture: 'swipeUp',
            }}
          />
          <Stack.Screen
            name="ScreenB"
            component={ScreenB}
            options={{
              transitionAnimation: SwipeRight,
              goBackGesture: 'swipeRight',
            }}
          />
          <Stack.Screen
            name="ScreenC"
            component={ScreenC}
            options={{
              goBackGesture: 'swipeDown',
            }}
          />
          <Stack.Screen
            name="ScreenD"
            component={ScreenD}
            options={{
              transitionAnimation: SwipeLeft,
              goBackGesture: 'swipeLeft',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureDetectorProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232736',
    justifyContent: 'center',
    borderRadius: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 10,
    color: '#EEF0FF',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 24,
    marginHorizontal: 10,
    color: '#001A72',
  },
  box: {
    height: 250,
    width: Dimensions.get('window').width / 2 - 20,
    margin: 10,
    borderRadius: 12,
  },
  boxA: {
    backgroundColor: '#C49FFE',
  },
  boxB: {
    backgroundColor: '#6FCEF5',
  },
  boxC: {
    backgroundColor: '#FF8B88',
  },
  boxD: {
    backgroundColor: '#7ADEAD',
  },
  row: {
    flexDirection: 'row',
  },
  pressable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

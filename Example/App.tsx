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
  Story: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
  <View style={styles.container}>
    <Text style={[styles.header, {}]}>Screen Transitions</Text>
    <View style={styles.row}>
      <Animated.View
        style={[styles.box, styles.boxA]}
        sharedTransitionTag="story">
        <Pressable
          onPress={() => navigation.navigate('Story')}
          style={styles.pressable}></Pressable>
      </Animated.View>
    </View>
  </View>
);

const StoryScreen = (): JSX.Element => {
  const [tag, setTag] = React.useState('story');

  useEffect(() => {
    setTag('');
    return () => {
      setTag('story');
    };
  });

  return (
    <Animated.View
      style={[styles.screen, styles.boxA]}
      sharedTransitionTag={tag}></Animated.View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const SwipeDown: AnimatedScreenTransition = {
  topScreenFrame: (event, screenSize) => {
    'worklet';
    const x = Math.abs(event.translationY / screenSize.height);
    const h = screenSize.height;
    const scaleY = (((98 - h) / 0.75) * x + h) / h;
    const scaleY2 =
      ((0 - 0.115) / (1 - 0.75)) * x + (0.115 * 1 - 0 * 0.75) / (1 - 0.75);
    return {
      transform: [
        { translateY: (h / 2) * x },
        {
          scaleY: x < 0.75 ? scaleY : scaleY2,
        },
        { scaleX: 1 - x },
      ],
      borderRadius: 250 * x - 250 * x * x,
      overflow: 'hidden',
      borderWidth: 0,
      borderColor: 'transparent',
    };
  },
  belowTopScreenFrame: (event, screenSize) => {
    'worklet';
    const x = Math.abs(event.translationY / screenSize.height);
    return {
      transform: [{ scale: 0.3 * x + 0.7 }],
    };
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
            name="Story"
            component={StoryScreen}
            options={{
              transitionAnimation: SwipeDown,
              goBackGesture: 'swipeDown',
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
    backgroundColor: '#000',
    justifyContent: 'center',
    borderRadius: 20,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 20,
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
    height: 100,
    width: 100,
    margin: 10,
    borderRadius: 50,
  },
  boxA: {
    backgroundColor: '#C49FFE',
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

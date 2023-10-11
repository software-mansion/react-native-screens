import {
  ReanimatedScreenProvider,
  useReanimatedHeaderHeight,
} from 'react-native-screens/reanimated';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  runOnJS,
  scrollTo,
  SharedValue,
  useAnimatedProps,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import ConfettiCannon from 'react-native-confetti-cannon';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import SwmLogo from './SwmLogo';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        height: '100%',
      }}>
      <Navigation />
    </View>
  );
};

const MainScreen = () => {
  const rotation = useSharedValue(0);
  const navigation = useNavigation();

  const easing = Easing.bezier(0.25, -0.5, 0.25, 1);

  React.useEffect(() => {
    rotation.value = withDelay(
      300,
      withSequence(
        withTiming(15, { duration: 300, easing }),
        withTiming(-15, { duration: 300, easing }),
        withTiming(0, { duration: 300, easing }),
      ),
    );

    const timeout = setTimeout(() => {
      navigation.navigate('Main');
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  // React.useEffect(() => {
  //   rotation.value = withSequence(
  //     withTiming(-180, { duration: 500, easing: Easing.ease }),
  //     withTiming(0, { duration: 500, easing: Easing.ease }),
  //   );
  // });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.main}>
      <View style={styles.mainTextLabel}>
        <Text
          style={[styles.mainText, { marginBottom: 5 }]}
          onPress={() => navigation.navigate('Main')}>
          Hey!
        </Text>
        <Animated.Text style={[styles.mainText, animatedStyle]}>
          👋
        </Animated.Text>
      </View>
    </View>
  );
};

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Screen = () => {
  const navigation = useNavigation();

  const minor = useSharedValue(10);

  const zoom = useSharedValue(1);

  const handleContentZoom = () => {
    'worklet';
    zoom.value = withDelay(
      150,
      withRepeat(
        withTiming(1.9, { duration: 200, easing: Easing.ease }),
        2,
        true,
      ),
    );
  };

  React.useEffect(() => {
    minor.value = withTiming(
      26.1,
      { duration: 1000, easing: Easing.out(Easing.quad) },
      () => handleContentZoom(),
    );
  }, []);

  const minorText = useDerivedValue(() => {
    if (minor.value < 10) {
      return `0${Math.trunc(minor.value).toString()}`;
    }

    return Math.trunc(minor.value).toString();
  });

  const minorAnimatedProps = useAnimatedProps(() => {
    return { text: minorText.value } as TextInputProps;
  });

  const zoomStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoom.value }],
  }));

  const opacitySharedValue = useSharedValue(0);
  const transitionSharedValue = useSharedValue(-30);

  React.useEffect(() => {
    opacitySharedValue.value = withDelay(
      1500,
      withTiming(1, {
        duration: 400,
        easing: Easing.ease,
      }),
    );
    transitionSharedValue.value = withDelay(
      1500,
      withTiming(10, {
        duration: 400,
        easing: Easing.ease,
      }),
    );

    const timeout = setTimeout(() => {
      navigation.navigate('Including');
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  const isHereStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: transitionSharedValue.value }],
      opacity: opacitySharedValue.value,
    };
  });

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
        <View style={{ marginBottom: 250, alignItems: 'center' }}>
          <Animated.View
            style={[{ flexDirection: 'row', overflow: 'visible' }, zoomStyle]}>
            <Text style={[styles.text, { marginRight: 10 }]}>3</Text>
            <Text style={styles.text}>.</Text>
            <AnimatedTextInput
              editable={false}
              value={minor.value.toString()}
              style={[
                styles.text,
                { width: 80, marginLeft: 14, marginRight: 5 },
              ]}
              animatedProps={minorAnimatedProps}
            />
            <Text style={[styles.text, { marginRight: 10 }]}>.</Text>
            <Text style={styles.text}>0</Text>
          </Animated.View>
          <Animated.View style={isHereStyle}>
            <Text style={styles.smallerText}>is here! 🔥</Text>
          </Animated.View>
        </View>
        <ConfettiCannon
          count={50}
          autoStartDelay={1500}
          origin={{ x: -10, y: 100 }}
          fallSpeed={1800}
          fadeOut={true}
        />
      </ScrollView>
    </>
  );
};

const IncludingScreen = () => {
  const navigation = useNavigation();
  const headerHeight = useReanimatedHeaderHeight();
  const [canNavigate, setCanNavigate] = useState(false);
  const [navigateTimeout, setNavigateTimeout] = useState<number>();
  // const EASING = Easing.bezier(0.25, 0.25, 0.25, 1);

  // React.useEffect(() => {
  //   rotation.value = withRepeat(
  //     withTiming(interpolate(headerHeight.value, [98, 300], [0, 30]), {
  //       duration: 100,
  //       easing: EASING,
  //     }),
  //     -1,
  //     true,
  //   );
  // }, []);

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [
  //       { scale: interpolate(headerHeight.value, [98, 250], [0.6, 0.9]) },
  //       { translateY: -400 },
  //     ],
  //     marginTop: 300,
  //     alignItems: 'center',
  //   };
  // });

  React.useEffect(() => {
    return () => {
      if (navigateTimeout !== undefined) {
        clearTimeout(navigateTimeout);
      }
    };
  }, [navigateTimeout]);

  const setHeaderTitle = (current: number) => {
    navigation.setOptions({
      headerTitle: `Header ${Math.trunc(current)}px tall 🔝`,
      headerTitleStyle: {
        color: interpolateColor(
          current,
          [98, 150],
          ['#33488E', '#FF6259'],
          'HSV',
          {
            useCorrectedHSVInterpolation: true,
          },
        ),
      },
    });
  };

  useAnimatedReaction(
    () => {
      return headerHeight;
    },
    current => {
      runOnJS(setHeaderTitle)(current.value);
    },
  );

  const navigate = () => {
    const timeout = setTimeout(() => navigation.navigate('Finish'), 250);
    setNavigateTimeout(timeout);
  };

  const bouncingHeaderHeight = useSharedValue(headerHeight.value);
  useAnimatedReaction(
    () => {
      return headerHeight.value;
    },
    (current, previous) => {
      if (current > (previous ?? 0)) {
        if (current > 200) {
          runOnJS(setCanNavigate)(true);
          bouncingHeaderHeight.value = 140;
          return;
        }

        bouncingHeaderHeight.value = current;
      } else {
        bouncingHeaderHeight.value = 100;
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: -250 },
        {
          scale: withTiming(
            interpolate(bouncingHeaderHeight.value, [150, 400], [0.5, 1.4]),
            { duration: 750, easing: Easing.elastic(4) },
            () => {
              if (canNavigate && bouncingHeaderHeight.value < 130) {
                runOnJS(navigate)();
              }
            },
          ),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        alignItems: 'center',
        marginTop: 150,
      }}
      style={styles.including}>
      <Text style={styles.smallerIncludingText}>Contains... new hook! 👀</Text>
      <Text style={styles.includingText}>useAnimatedHeaderHeight()</Text>
      <Animated.Image source={require('./screens.png')} style={animatedStyle} />
    </Animated.ScrollView>
  );
};

const FinishScreen = () => {
  const npmOpacity = useSharedValue(0);

  React.useEffect(() => {
    const timing = withTiming(1, { duration: 350 });
    npmOpacity.value = withDelay(700, timing);
  }, []);

  return (
    <View style={styles.finish}>
      <SwmLogo />
      <Animated.View
        style={{
          opacity: npmOpacity,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Image source={require('./npm.png')} style={styles.finishImage} />
        <Text style={styles.finishText}>/ react-native-screens</Text>
      </Animated.View>
    </View>
  );
};

const Navigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <ReanimatedScreenProvider>
        <Stack.Navigator
          screenOptions={{
            headerHideBackButton: true,
            statusBarHidden: true,
            headerLargeTitle: true,
            headerShown: false,
            headerTranslucent: true,
            headerLargeTitleHideShadow: true,
          }}>
          {/*<Stack.Screen*/}
          {/*  name="Start"*/}
          {/*  component={MainScreen}*/}
          {/*  options={{*/}
          {/*    headerShown: false,*/}
          {/*  }}*/}
          {/*/>*/}
          {/*<Stack.Screen name="Main" component={Screen} />*/}
          <Stack.Screen
            name="Including"
            component={IncludingScreen}
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#b8dcf9' },
              statusBarHidden: true,
              headerTitle: '🎉🎉🎉',
            }}
          />
          <Stack.Screen
            name="Finish"
            component={FinishScreen}
            options={{ stackAnimation: 'slide_from_bottom' }}
          />
        </Stack.Navigator>
      </ReanimatedScreenProvider>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    backgroundColor: '#0A2688',
    flex: 1,
    justifyContent: 'center',
  },
  mainText: {
    color: 'white',
    fontSize: 50,
    fontFamily: 'Aeonik-Bold',
  },
  mainTextLabel: {
    marginTop: 398,
    alignItems: 'center',
  },
  mainTextHand: {},
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFAE1',
  },
  smallerText: {
    fontSize: 30,
    color: '#6676AA',
    fontFamily: 'Aeonik-Medium',
    fontWeight: '500',
  },
  text: {
    fontSize: 60,
    color: '#33488E',
    fontWeight: 'bold',
    fontFamily: 'Aeonik-Bold',
  },
  including: {
    flex: 1,
    backgroundColor: '#92C9F7',
  },
  smallerIncludingText: {
    fontSize: 25,
    marginBottom: 10,
    color: '#001A72',
    fontFamily: 'Aeonik-Medium',
  },
  includingText: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Aeonik-Bold',
    color: '#001A72',
  },
  finish: {
    backgroundColor: '#0A2688',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishImage: {
    width: 75,
    marginTop: 10,
    resizeMode: 'contain',
  },
  finishText: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'Aeonik-Medium',
    marginLeft: 10,
  },
});

export default App;

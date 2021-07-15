import * as React from 'react';
import {
  Button,
  View,
  Animated as RNAnimated,
} from 'react-native';
import {
  createAppContainer,
} from 'react-navigation';

import createNativeStackNavigator, {NativeStackNavigationOptions, NativeStackNavigationProp} from 'react-native-screens/createNativeStackNavigator';	
import {useTransitionProgress} from 'react-native-screens';
import {useReanimatedTransitionProgress} from 'react-native-screens/reanimated';
import Animated, {useAnimatedStyle, useDerivedValue} from 'react-native-reanimated';

const DEFAULT_STACK_OPTIONS : NativeStackNavigationOptions
 = {
	headerTintColor: 'black',
	headerTitleStyle: {
    fontFamily: 'arial',
  },
	headerStyle: {
		backgroundColor: 'powderblue',
	},
	cardStyle: {
		backgroundColor: 'white',
	},
  headerTitle: 'Home',
	hideShadow: true,
	headerTopInsetEnabled: false,
};

function makeStacks() {
	const PushStack = createNativeStackNavigator(
		{
			Home1: Home,
		},
		{
			defaultNavigationOptions: DEFAULT_STACK_OPTIONS,
		},
	);
	const ModalPushStack = createNativeStackNavigator(
		{
			Home2: Home,
		},
		{
			defaultNavigationOptions: DEFAULT_STACK_OPTIONS,
		},
	);
	const ModalStack = createNativeStackNavigator(
		{
			PushStack,
			Home3: ModalPushStack,
			Home4: {
				screen: Home,
				navigationOptions: {
					cardTransparent: true,
					stackAnimation: 'fade',
					cardStyle: {
						backgroundColor: 'blue',
          },
				},
			},
		},
		{
			headerMode: 'none',
		},
	);
	const MainStack = createNativeStackNavigator(
		{
			ModalStack,
			Home5: {
				screen: Home,
				navigationOptions: {
					stackAnimation: 'slide_from_right',
				},
			},
		},
		{
			headerMode: 'none',
		},
	);
	return MainStack;
}

export default createAppContainer(makeStacks());

function Home({navigation}: {navigation: NativeStackNavigationProp}) {
  const reaProgress = useReanimatedTransitionProgress();
  const sv = useDerivedValue(() => (reaProgress.progress.value < 0.5 ? (reaProgress.progress.value * 50) : ((1 - reaProgress.progress.value) * 50)) + 50);
  const reaStyle = useAnimatedStyle(() => {
    return {
      width: sv.value,
      height: sv.value,
      backgroundColor: 'blue',
    };
  });

  const {progress} = useTransitionProgress();
  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.0 ,1.0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <RNAnimated.View style={{opacity, height: 50, backgroundColor: 'green'}} />
      <Animated.View style={reaStyle} />
      <Button title="Go forward" onPress={() => navigation.navigate("Home5")} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

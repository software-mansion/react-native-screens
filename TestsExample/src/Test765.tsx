import * as React from 'react';
import {
  Button,
  View,
  Animated
} from 'react-native';
import {
  createAppContainer,
} from 'react-navigation';

import createNativeStackNavigator, {NativeStackNavigationOptions, NativeStackNavigationProp} from 'react-native-screens/createNativeStackNavigator';	
import {useTransitionProgress} from 'react-native-screens/native-stack';	

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
			// mode: 'containedModal',
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
			// mode: 'containedModal',
		},
	);
	return MainStack;
}

export default createAppContainer(makeStacks());

function Home({navigation}: {navigation: NativeStackNavigationProp}) {

  const {progress} = useTransitionProgress();

  const opacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1.0, 0.0 ,1.0],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
      <Animated.View style={{opacity, height: 50, backgroundColor: 'green'}} />
      <Button title="Go forward" onPress={() => navigation.navigate("Home5")} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

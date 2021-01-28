import * as React from 'react';
import {
  View,
} from 'react-native';
import {
  createAppContainer,
} from 'react-navigation';

import createNativeStackNavigator, {NativeStackNavigationOptions} from 'react-native-screens/createNativeStackNavigator';	

const DEFAULT_STACK_OPTIONS : NativeStackNavigationOptions
 = {
	headerBackTitleVisible: false,
	headerTintColor: 'black',
	headerTitleStyle: {
    fontFamily: 'arial',
  },
	headerStyle: {
		backgroundColor: 'white',
	},
	cardStyle: {
		backgroundColor: 'white',
	},
	hideShadow: true,
	backButtonImage: undefined,
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
					gestureEnabled: false,
					stackAnimation: 'fade',
					cardStyle: {
						backgroundColor: 'blue',
          },
				},
			},
		},
		{
			headerMode: 'none',
			mode: 'containedModal',
		},
	);
	const MainStack = createNativeStackNavigator(
		{
			ModalStack,
			Home5: {
				screen: Home,
				navigationOptions: {
					gestureEnabled: false,
					stackAnimation: 'fade',
				},
			},
		},
		{
			headerMode: 'none',
			mode: 'containedModal',
		},
	);
	return MainStack;
}

export default createAppContainer(makeStacks());

function Home() {
  return (
    <View style={{ flex: 1, backgroundColor: 'red' }}>
    </View>
  );
}

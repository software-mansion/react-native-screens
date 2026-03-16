import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { findNodeHandle, Text, View } from 'react-native';
import PressableWithFeedback from '../../shared/PressableWithFeedback';

type StackParamList = {
  Home: undefined,
}

type RouteProps = {
  navigation: NativeStackNavigationProp<StackParamList>;
}

const Stack = createNativeStackNavigator<StackParamList>();

function HeaderTitle(): React.JSX.Element {
  return (
    <PressableWithFeedback
      onLayout={event => {
        const { x, y, width, height } = event.nativeEvent.layout;
        console.log('Title onLayout', { x, y, width, height });
      }}
      onPressIn={() => {
        console.log('Pressable onPressIn');
      }}
      onPress={() => console.log('Pressable onPress')}
      onPressOut={() => console.log('Pressable onPressOut')}
      onResponderMove={() => console.log('Pressable onResponderMove')}
      ref={node => {
        console.log(findNodeHandle(node));
        node?.measure((x, y, width, height, pageX, pageY) => {
          console.log('header component measure', { x, y, width, height, pageX, pageY });
        });
      }}
    >
      <View style={{ height: 40, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ alignItems: 'center' }}>Regular Pressable</Text>
      </View>
    </PressableWithFeedback>
  );
}

function HeaderLeft(): React.JSX.Element {
  return (
    <HeaderTitle />
  );
}

function Home(_: RouteProps): React.JSX.Element {
  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, .8)' }}
    >
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',marginTop: 48 }}>
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
            headerTransparent: true,
            headerTitle: HeaderTitle,
            headerLeft: HeaderLeft,
            headerRight: HeaderLeft,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

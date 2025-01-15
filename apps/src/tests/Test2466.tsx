import { Header } from '@react-navigation/elements';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { ForwardedRef } from 'react';
import { findNodeHandle, GestureResponderEvent, Pressable, PressableProps, StyleSheet, Text, View } from 'react-native';

type StackParamList = {
  Home: undefined,
}

type RouteProps = {
  navigation: NativeStackNavigationProp<StackParamList>;
}

type PressableState = 'pressed-in' | 'pressed' | 'pressed-out'


const Stack = createNativeStackNavigator<StackParamList>();

const PressableWithFeedback = React.forwardRef((props: PressableProps, ref: ForwardedRef<View>): React.JSX.Element => {
  const [pressedState, setPressedState] = React.useState<PressableState>('pressed-out');

  const onPressInCallback = React.useCallback((e: GestureResponderEvent) => {
    console.log('Pressable onPressIn', {
      locationX: e.nativeEvent.locationX,
      locationY: e.nativeEvent.locationY,
      pageX: e.nativeEvent.pageX,
      pageY: e.nativeEvent.pageY,
    });
    setPressedState('pressed-in');
    props.onPressIn?.(e);
  }, [props]);

  const onPressCallback = React.useCallback((e: GestureResponderEvent) => {
    console.log('Pressable onPress');
    setPressedState('pressed');
    props.onPress?.(e);
  }, [props]);

  const onPressOutCallback = React.useCallback((e: GestureResponderEvent) => {
    console.log('Pressable onPressOut');
    setPressedState('pressed-out');
    props.onPressOut?.(e);
  }, [props]);

  const onResponderMoveCallback = React.useCallback((e: GestureResponderEvent) => {
    console.log('Pressable onResponderMove');
    props.onResponderMove?.(e);
  }, [props]);

  const contentsStyle = pressedState === 'pressed-out'
    ? styles.pressablePressedOut
    : (pressedState === 'pressed'
      ? styles.pressablePressed
      : styles.pressablePressedIn);

  return (
    <View ref={ref} style={[contentsStyle]}>
      <Pressable
        onPressIn={onPressInCallback}
        onPress={onPressCallback}
        onPressOut={onPressOutCallback}
        onResponderMove={onResponderMoveCallback}
      >
        {props.children}
      </Pressable>
    </View>

  );
});

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
            headerLeft: HeaderLeft,
            headerRight: HeaderLeft,
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
  },
});


export default App;

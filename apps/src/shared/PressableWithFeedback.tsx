import React from 'react';
import { ForwardedRef } from 'react';
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, View } from 'react-native';
import Colors from './styling/Colors';

export type PressableState = 'pressed-in' | 'pressed' | 'pressed-out'

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
        {...props}
        onPressIn={onPressInCallback}
        onPress={onPressCallback}
        onPressOut={onPressOutCallback}
        onResponderMove={onResponderMoveCallback}
        style={props.style}
      >
        {props.children}
      </Pressable>
    </View>

  );
});

const styles = StyleSheet.create({
  pressablePressedIn: {
    backgroundColor: Colors.BlueLight100,
  },
  pressablePressed: {
    backgroundColor: Colors.YellowLight100,
  },
  pressablePressedOut: {
    backgroundColor: Colors.PurpleLight100,
  },
});

export default PressableWithFeedback;


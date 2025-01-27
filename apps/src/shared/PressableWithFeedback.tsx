import React from 'react';
import { ForwardedRef } from 'react';
import { GestureResponderEvent, Pressable, PressableProps, StyleSheet, TouchableWithoutFeedback, TouchableWithoutFeedbackProps, View } from 'react-native';

export type PressableState = 'pressed-in' | 'pressed' | 'pressed-out'

export const PressableWithFeedback = React.forwardRef((props: PressableProps, ref: ForwardedRef<View>): React.JSX.Element => {
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

export const TouchableWithFeedback = React.forwardRef((props: TouchableWithoutFeedbackProps, ref: ForwardedRef<View>) => {
  const [pressedState, setPressedState] = React.useState<PressableState>('pressed-out');

  const onPressInCallback = React.useCallback((e: GestureResponderEvent) => {
    console.log('Touchable onPressIn', {
      locationX: e.nativeEvent.locationX,
      locationY: e.nativeEvent.locationY,
      pageX: e.nativeEvent.pageX,
      pageY: e.nativeEvent.pageY,
    });
    setPressedState('pressed-in');
    props.onPressIn?.(e);
  }, [props]);

  const onPressCallback = React.useCallback((e: GestureResponderEvent) => {
    console.log('Touchable onPress');
    setPressedState('pressed');
    props.onPress?.(e);
  }, [props]);

  const onPressOutCallback = React.useCallback((e: GestureResponderEvent) => {
    console.log('Touchable onPressOut');
    setPressedState('pressed-out');
    props.onPressOut?.(e);
  }, [props]);

  const contentsStyle = pressedState === 'pressed-out'
    ? styles.touchablePressedOut
    : (pressedState === 'pressed'
      ? styles.touchablePressed
      : styles.touchablePressedIn);

  return (
    <View ref={ref} style={[contentsStyle]}>
      <TouchableWithoutFeedback
        onPressIn={onPressInCallback}
        onPress={onPressCallback}
        onPressOut={onPressOutCallback}
      >
        {props.children}
      </TouchableWithoutFeedback>
    </View>
  );
});

const styles = StyleSheet.create({
  pressablePressedIn: {
    backgroundColor: 'orange',
  },
  pressablePressed: {
    backgroundColor: 'crimson',
  },
  pressablePressedOut: {
    backgroundColor: 'lightseagreen',
  },
  touchablePressedIn: {
    backgroundColor: 'orange',
  },
  touchablePressed: {
    backgroundColor: 'lightseagreen',
  },
  touchablePressedOut: {
    backgroundColor: 'crimson',
  }
});

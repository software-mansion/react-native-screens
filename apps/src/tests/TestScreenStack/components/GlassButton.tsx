import React from 'react';
import {
  LiquidGlassView,
  // @ts-ignore its fine
} from '@callstack/liquid-glass';
import { Pressable, StyleSheet } from 'react-native';

export function GlassButton({
  children,
  tintColor = '#fafafaaa',
  // tintColor = '#ecfeffaa',
  onPress,
}: {
  children: React.ReactNode;
  tintColor?: string;
  onPress?: () => void;
}) {
  return (
    // <Pressable onPress={onPress}>
    <LiquidGlassView
      style={styles.container}
      interactive
      effect="clear"
      tintColor={tintColor}>
      {children}
    </LiquidGlassView>
    // </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 32,
  },
});

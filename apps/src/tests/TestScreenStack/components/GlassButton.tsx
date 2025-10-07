import React from 'react';
import {
  LiquidGlassView,
  // @ts-ignore its fine
} from '@callstack/liquid-glass';
import { Pressable, StyleSheet } from 'react-native';

export function GlassButton({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <LiquidGlassView style={styles.container} interactive effect="regular">
        {children}
      </LiquidGlassView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 20,
  },
});

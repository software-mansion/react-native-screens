import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeColorPalette } from './styling/theme/useThemeColorPalette';

export const ThemedView = ({ children, style, ...props }: ViewProps) => {
  const { colors } = useThemeColorPalette();
  return (
    <View style={[{ backgroundColor: colors.offBackground }, style]} {...props}>
      {children}
    </View>
  );
};

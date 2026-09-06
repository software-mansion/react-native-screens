import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeColorPalette } from './styling/theme/useThemeColorPalette';

export const ThemedText = ({ children, style, ...props }: TextProps) => {
  const { colors } = useThemeColorPalette();

  return (
    <Text style={[{ color: colors.text }, style]} {...props}>
      {children}
    </Text>
  );
};

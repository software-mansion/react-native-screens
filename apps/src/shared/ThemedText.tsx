import React from 'react';
import { Text, TextProps } from 'react-native';
<<<<<<< HEAD
import useThemeColorPallette from './styling/theme-provider/useColorPallette';

export const ThemedText = ({ children, style, ...props }: TextProps) => {
  const { colors } = useThemeColorPallette();
=======
import useThemeColorPalette from './styling/theme/useColorPalette';

export const ThemedText = ({ children, style, ...props }: TextProps) => {
  const { colors } = useThemeColorPalette();
>>>>>>> 5b37ce96b46eaa7017e357187bc76996f95f3b96

  return (
    <Text style={[{ color: colors.text }, style]} {...props}>
      {children}
    </Text>
  );
};

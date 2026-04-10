import React from 'react';
import { Text, TextProps } from 'react-native';
import useThemeColorPallette from './styling/theme/useColorPallette';

export const ThemedText = ({ children, style, ...props }: TextProps) => {
  const { colors } = useThemeColorPallette();

  return (
    <Text style={[{ color: colors.text }, style]} {...props}>
      {children}
    </Text>
  );
};

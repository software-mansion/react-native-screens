import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, TextProps } from 'react-native';

export const ThemedText = ({ children, style, ...props }: TextProps) => {
  const { colors } = useTheme();

  return (
    <Text style={[{ color: colors.text }, style]} {...props}>
      {children}
    </Text>
  );
};

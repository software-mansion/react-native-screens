import { useTheme } from '@react-navigation/native';
import React from 'react';
import { View, ViewProps } from 'react-native';

export const ThemedView = ({ children, style, ...props }: ViewProps) => {
  const { colors } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.card }, style]} {...props}>
      {children}
    </View>
  );
};

import React from 'react';
import { View, ViewProps } from 'react-native';
import useThemeColorPallette from './styling/adapter/react-navigation/useColorPallette';

export const ThemedView = ({ children, style, ...props }: ViewProps) => {
  const { colors } = useThemeColorPallette();
  return (
    <View style={[{ backgroundColor: colors.offBackground }, style]} {...props}>
      {children}
    </View>
  );
};

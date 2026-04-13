import React from 'react';
import { View, ViewProps } from 'react-native';
<<<<<<< HEAD
import useThemeColorPallette from './styling/theme-provider/useColorPallette';
=======
import useThemeColorPalette from './styling/theme/useColorPalette';
>>>>>>> 5b37ce96b46eaa7017e357187bc76996f95f3b96

export const ThemedView = ({ children, style, ...props }: ViewProps) => {
  const { colors } = useThemeColorPalette();
  return (
    <View style={[{ backgroundColor: colors.offBackground }, style]} {...props}>
      {children}
    </View>
  );
};

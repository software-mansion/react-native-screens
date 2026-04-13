import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
<<<<<<< HEAD
import useThemeColorPallette from './styling/theme-provider/useColorPallette';

export const ThemedTextInput = ({ style, ...props }: TextInputProps) => {
  const { colors } = useThemeColorPallette();
=======
import useThemeColorPalette from './styling/theme/useColorPalette';

export const ThemedTextInput = ({ style, ...props }: TextInputProps) => {
  const { colors } = useThemeColorPalette();
>>>>>>> 5b37ce96b46eaa7017e357187bc76996f95f3b96

  return (
    <TextInput
      style={[{ borderColor: colors.cardBorder, color: colors.text }, style]}
      {...props}
    />
  );
};

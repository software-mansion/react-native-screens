import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import useThemeColorPallette from './styling/theme-provider/useColorPallette';

export const ThemedTextInput = ({ style, ...props }: TextInputProps) => {
  const { colors } = useThemeColorPallette();

  return (
    <TextInput
      style={[{ borderColor: colors.cardBorder, color: colors.text }, style]}
      {...props}
    />
  );
};

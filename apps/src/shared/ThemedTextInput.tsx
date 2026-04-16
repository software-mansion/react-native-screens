import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { useThemeColorPalette } from './styling/theme/useThemeColorPalette';

export const ThemedTextInput = ({ style, ...props }: TextInputProps) => {
  const { colors } = useThemeColorPalette();

  return (
    <TextInput
      style={[{ borderColor: colors.cardBorder, color: colors.text }, style]}
      {...props}
    />
  );
};

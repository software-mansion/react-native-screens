import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

export const ThemedTextInput = ({ style, ...props }: TextInputProps) => {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[{ borderColor: colors.border, color: colors.text }, style]}
      {...props}
    />
  );
};

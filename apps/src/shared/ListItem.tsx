import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
  testID?: string;
  disabled?: boolean;
}

export const ListItem = ({
  title,
  onPress,
  testID,
  disabled,
}: Props): React.JSX.Element => {
  const isDark = useTheme().dark;
  return (
    <TouchableOpacity onPress={onPress} testID={testID} disabled={disabled}>
      <View
        style={[
          styles.container,
          isDark ? styles.containerDark : styles.containerLight,
        ]}>
        <Text
          style={[
            isDark ? styles.titleDark : styles.titleLight,
            disabled && styles.disabled,
          ]}>
          {disabled && '(N/A) '}
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  containerLight: {
    backgroundColor: DefaultTheme.colors.card,
    borderColor: DefaultTheme.colors.border,
  },
  containerDark: {
    backgroundColor: DarkTheme.colors.card,
    borderColor: DarkTheme.colors.border,
  },
  disabled: {
    color: 'gray',
  },
  titleLight: {
    color: DefaultTheme.colors.text,
  },
  titleDark: {
    color: DarkTheme.colors.text,
  },
});

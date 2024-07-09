import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';

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
  const scheme = useColorScheme();
  return (
    <TouchableOpacity onPress={onPress} testID={testID} disabled={disabled}>
      <View
        style={[
          styles.container,
          scheme === 'dark' ? styles.containerDark : styles.containerLight,
        ]}>
        <Text
          style={[
            scheme === 'dark' ? styles.titleDark : styles.titleLight,
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

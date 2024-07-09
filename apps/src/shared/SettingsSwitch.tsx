import React from 'react';
import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
};

export const SettingsSwitch = ({
  label,
  value,
  onValueChange,
  style = {},
}: Props): React.JSX.Element => {
  const isDark = useTheme().dark;
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)}>
      <View
        style={[
          styles.container,
          isDark ? styles.containerDark : styles.containerLight,
          style,
        ]}>
        <Text
          style={[
            styles.label,
            isDark ? styles.labelDark : styles.labelLight,
          ]}>{`${label}: ${value}`}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#039be5',
    backgroundColor: 'white',
  },
  containerLight: {
    backgroundColor: DefaultTheme.colors.card,
  },
  containerDark: {
    backgroundColor: DarkTheme.colors.card,
  },
  label: {
    fontSize: 15,
  },
  labelLight: {
    color: DefaultTheme.colors.text,
  },
  labelDark: {
    color: DarkTheme.colors.text,
  },
});

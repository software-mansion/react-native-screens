import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';

type Props = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
};

export const SettingsInput = ({
  label,
  value,
  onValueChange,
}: Props): React.JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = useTheme().dark;
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
      <View
        style={[
          styles.container,
          isDark ? styles.containerDark : styles.containerLight,
        ]}>
        <Text
          style={[
            styles.label,
            isDark ? styles.labelDark : styles.labelLight,
          ]}>{`${label}: ${value}`}</Text>
        {isOpen ? (
          <TextInput
            style={[
              styles.input,
              isDark ? styles.inputDark : styles.inputLight,
            ]}
            value={value}
            onChangeText={onValueChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : null}
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
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
  },
  inputLight: {
    borderColor: DefaultTheme.colors.border,
    color: DefaultTheme.colors.text,
  },
  inputDark: {
    borderColor: DarkTheme.colors.border,
    color: DarkTheme.colors.text,
  },
});

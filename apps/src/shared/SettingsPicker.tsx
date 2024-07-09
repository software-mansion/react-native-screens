import { DarkTheme, DefaultTheme, useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

type Props<T = string> = {
  testID?: string;
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  items: T[];
  style?: ViewStyle;
};

export function SettingsPicker<T extends string>({
  testID,
  label,
  value,
  onValueChange,
  items,
  style = {},
}: Props<T>): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const isDark = useTheme().dark;
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDark ? styles.containerDark : styles.containerLight,
        style,
      ]}
      onPress={() => setIsOpen(!isOpen)}>
      <Text
        testID={testID}
        style={[
          styles.label,
          isDark ? styles.labelDark : styles.labelLight,
        ]}>{`${label}: ${value}`}</Text>
      {isOpen
        ? items.map(item => (
            <TouchableOpacity key={item} onPress={() => onValueChange(item)}>
              <Text
                testID={`${label.split(' ').join('-')}-${item}`.toLowerCase()}
                style={[
                  styles.item,
                  isDark ? styles.itemDark : styles.itemLight,
                  item === value && { fontWeight: 'bold' },
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))
        : null}
    </TouchableOpacity>
  );
}

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
  picker: {
    height: 50,
    width: 100,
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  itemLight: {
    color: DefaultTheme.colors.text,
  },
  itemDark: {
    color: DarkTheme.colors.text,
  },
});

import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { WHITE } from '../colors';

type Props<T = string> = {
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  items: T[];
  style?: ViewStyle;
};

export function SettingsPicker<T extends string>({
  label,
  value,
  onValueChange,
  items,
  style = {},
}: Props<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TouchableOpacity
      style={{ ...styles.container, ...style }}
      onPress={() => setIsOpen(!isOpen)}>
      <Text style={styles.label}>{`${label}: ${value}`}</Text>
      {isOpen
        ? items.map((item) => (
            <TouchableOpacity key={item} onPress={() => onValueChange(item)}>
              <Text
                style={
                  item === value
                    ? { ...styles.item, fontWeight: 'bold' }
                    : styles.item
                }>
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
    backgroundColor: WHITE,
  },
  label: {
    fontSize: 15,
    color: 'black',
  },
  picker: {
    height: 50,
    width: 100,
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 20,
    color: 'black',
  },
});

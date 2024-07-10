import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedText, ThemedView } from '.';

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
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
      <ThemedView style={[styles.container, style]}>
        <ThemedText
          testID={testID}
          style={styles.label}>{`${label}: ${value}`}</ThemedText>
        {isOpen
          ? items.map(item => (
              <TouchableOpacity key={item} onPress={() => onValueChange(item)}>
                <ThemedText
                  testID={`${label.split(' ').join('-')}-${item}`.toLowerCase()}
                  style={[
                    styles.item,
                    item === value && { fontWeight: 'bold' },
                  ]}>
                  {item}
                </ThemedText>
              </TouchableOpacity>
            ))
          : null}
      </ThemedView>
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
  label: {
    fontSize: 15,
  },
  picker: {
    height: 50,
    width: 100,
  },
  item: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
});

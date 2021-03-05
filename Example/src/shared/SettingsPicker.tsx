import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

type Props<Type = string> = {
  label: string;
  value: Type;
  onValueChange: (value: Type) => void;
  items: Type[];
};

export function SettingsPicker<T>({
  label,
  value,
  onValueChange,
  items,
}: Props<T>): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsOpen(!isOpen)}>
      <Text style={styles.label}>{`${label}: ${value}`}</Text>
      {isOpen
        ? items.map((item) => (
            <TouchableOpacity
              key={(item as unknown) as string}
              onPress={() => onValueChange(item)}>
              <Text
                style={
                  item === value
                    ? {...styles.item, fontWeight: 'bold'}
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
    backgroundColor: 'white',
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

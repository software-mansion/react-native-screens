import React, {useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';

type Props = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  items: string[];
};

export const SettingsPicker = ({
  label,
  value,
  onValueChange,
  items,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setIsOpen(!isOpen)}>
      <Text>{`${label}: ${value}`}</Text>
      {isOpen
        ? items.map((item) => (
            <TouchableOpacity key={item} onPress={() => onValueChange(item)}>
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
  label: {
    fontSize: 16,
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

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
  return (
    <TouchableOpacity onPress={onPress} testID={testID} disabled={disabled}>
      <View style={styles.container}>
        <Text style={[styles.title, disabled && styles.disabled]}>{disabled && '(N/A) '}{title}</Text>
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
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
  },
  disabled: {
    color: 'gray',
  },
  title: {
    color: 'black',
  },
  chevron: {
    fontWeight: 'bold',
    color: 'black',
  },
});

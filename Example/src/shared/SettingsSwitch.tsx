import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export const SettingsSwitch = ({
  label,
  value,
  onValueChange,
}: Props): JSX.Element => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)}>
      <View style={styles.container}>
        <Text style={styles.label}>{`${label}: ${value}`}</Text>
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
  label: {
    fontSize: 15,
    color: 'black',
  },
});

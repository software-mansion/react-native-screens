import * as React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';

type Props = {
  label: string;
  value: boolean;
  onPress: (value: boolean) => void;
};

export const SettingsSwitch = ({label, value, onPress}: Props): JSX.Element => {
  return (
    <TouchableOpacity onPress={() => onPress(!value)}>
      <View style={styles.container}>
        <Text>{`${label}: ${value}`}</Text>
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
  },
  label: {
    fontSize: 16,
  },
});

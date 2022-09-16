import React from 'react';
import { Text, View, Pressable, StyleSheet, TextInput } from 'react-native';

type Props = {
  label: string;
  handlers: {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
  }[];
};

export function SettingsMultiInput({ label, handlers }: Props): JSX.Element {
  return (
    <Pressable>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        {handlers.map(({ label, value, onValueChange }) => (
          <View style={styles.labelWrapper} key={`label-input-${label}`}>
            <Text style={styles.inputLabel}>{`${label}`}</Text>
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onValueChange}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
            />
          </View>
        ))}
      </View>
    </Pressable>
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
  labelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: 'black',
  },
  input: {
    height: 40,
    flex: 1,
    borderWidth: 1,
    borderColor: 'black',
  },
  inputLabel: {
    fontSize: 15,
    color: 'black',
    width: 100,
  },
});

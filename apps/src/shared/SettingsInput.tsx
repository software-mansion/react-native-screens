import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, ThemedView, ThemedTextInput } from '.';

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
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
      <ThemedView style={styles.container}>
        <ThemedText style={styles.label}>{`${label}: ${value}`}</ThemedText>
        {isOpen ? (
          <ThemedTextInput
            style={styles.input}
            value={value}
            onChangeText={onValueChange}
            autoCapitalize="none"
            autoCorrect={false}
          />
        ) : null}
      </ThemedView>
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
  label: {
    fontSize: 15,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
  },
});

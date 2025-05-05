import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ThemedText, ThemedView } from '.';

type Props = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  style?: ViewStyle;
  testID?: string;
};

export const SettingsSwitch = ({
  label,
  value,
  onValueChange,
  style = {},
  testID,
}: Props): React.JSX.Element => {
  return (
    <TouchableOpacity onPress={() => onValueChange(!value)} testID={testID}>
      <ThemedView style={[styles.container, style]}>
        <ThemedText style={styles.label}>{`${label}: ${value}`}</ThemedText>
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
});

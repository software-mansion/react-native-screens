import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { ThemedText, ThemedView } from '.';
import Colors from './styling/Colors';

type Props = TouchableOpacityProps & {
  label: string;
};

export const SettingsTouchable = ({
  label,
  style = {},
  ...rest
}: Props): React.JSX.Element => {
  return (
    <TouchableOpacity {...rest}>
      <ThemedView style={[styles.container, style]}>
        <ThemedText style={styles.label}>{label}</ThemedText>
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
    borderColor: Colors.cardBorder,
  },
  label: {
    fontSize: 15,
  },
});

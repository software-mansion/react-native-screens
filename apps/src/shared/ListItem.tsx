import { useTheme } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText, ThemedView } from '.';

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
  const { colors } = useTheme();
  return (
    <TouchableOpacity onPress={onPress} testID={testID} disabled={disabled}>
      <ThemedView style={[styles.container, { borderColor: colors.border }]}>
        <ThemedText style={disabled ? styles.disabled : undefined}>
          {disabled && '(N/A) '}
          {title}
        </ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  disabled: {
    color: 'gray',
  },
});

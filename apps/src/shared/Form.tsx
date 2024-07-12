import React, { Fragment } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText, ThemedTextInput } from '.';

const fields = [
  { name: 'form-first-name', placeholder: 'First Name *' },
  { name: 'form-last-name', placeholder: 'Last Name *' },
  { name: 'form-email', placeholder: 'Email *' },
];

export const Form = (): React.JSX.Element => {
  return (
    <View testID="form" style={styles.wrapper}>
      <ThemedText testID="form-header" style={styles.heading}>
        Example form
      </ThemedText>
      {fields.map(({ name, placeholder }) => (
        <Fragment key={name}>
          <ThemedText testID={`${name}-label`} style={styles.label}>
            {placeholder}
          </ThemedText>
          <ThemedTextInput testID={`${name}-input`} style={styles.input} />
        </Fragment>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    margin: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    height: 40,
  },
});

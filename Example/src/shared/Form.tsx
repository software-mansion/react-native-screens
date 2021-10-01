import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';

export const Form = (): JSX.Element => (
  <View testID="form" style={styles.wrapper}>
    <Text testID="form-header" style={styles.heading}>
      Example form
    </Text>
    <Text testID="form-first-name-label" style={styles.label}>
      First Name *
    </Text>
    <TextInput testID="form-first-name-input" style={styles.input} />
    <Text testID="form-last-name-label" style={styles.label}>
      Last Name *
    </Text>
    <TextInput testID="form-last-name-input" style={styles.input} />
    <Text testID="form-email-label" style={styles.label}>
      Email *
    </Text>
    <TextInput testID="form-email-input" style={styles.input} />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    margin: 15,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  label: {
    color: 'darkslategray',
    textTransform: 'capitalize',
    fontSize: 12,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'black',
    marginBottom: 12,
    height: 40,
  },
});

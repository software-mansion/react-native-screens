import React from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

export const Form = (): JSX.Element => (
  <View style={styles.wrapper}>
    <Text style={styles.heading}>Example form</Text>
    <Text style={styles.label}>First Name *</Text>
    <TextInput style={styles.input} />
    <Text style={styles.label}>Last Name *</Text>
    <TextInput style={styles.input} />
    <Text style={styles.label}>Email *</Text>
    <TextInput style={styles.input} />
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

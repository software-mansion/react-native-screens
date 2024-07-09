import React, { Fragment } from 'react';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
} from 'react-native';

const fields = [
  { name: 'form-first-name', placeholder: 'First Name *' },
  { name: 'form-last-name', placeholder: 'Last Name *' },
  { name: 'form-email', placeholder: 'Email *' },
];

export const Form = (): React.JSX.Element => {
  const scheme = useColorScheme();
  return (
    <View testID="form" style={styles.wrapper}>
      <Text
        testID="form-header"
        style={[
          styles.heading,
          scheme === 'dark' ? styles.labelDark : styles.labelLight,
        ]}>
        Example form
      </Text>
      {fields.map(({ name, placeholder }) => (
        <Fragment key={name}>
          <Text
            testID={`${name}-label`}
            style={[
              styles.label,
              scheme === 'dark' ? styles.labelDark : styles.labelLight,
            ]}>
            {placeholder}
          </Text>
          <TextInput
            testID={`${name}-input`}
            style={[
              styles.input,
              scheme === 'dark' ? styles.inputDark : styles.inputLight,
            ]}
          />
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
  headingLight: {
    color: DefaultTheme.colors.text,
  },
  headingDark: {
    color: DarkTheme.colors.text,
  },
  label: {
    textTransform: 'capitalize',
    fontSize: 12,
    marginBottom: 8,
  },
  labelLight: {
    color: DefaultTheme.colors.text,
  },
  labelDark: {
    color: DarkTheme.colors.text,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    height: 40,
  },
  inputLight: {
    borderColor: DefaultTheme.colors.border,
  },
  inputDark: {
    borderColor: DarkTheme.colors.border,
  },
});

import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  KeyboardTypeOptions,
} from 'react-native';
import {WHITE} from '../colors';

type Props = {
  label: string;
  value?: string;
  onValueChange: (value: string) => void;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
};

export const SettingsInput = ({
  label,
  value,
  onValueChange,
  keyboardType,
  placeholder,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
      <View style={styles.container}>
        <Text style={styles.label}>{`${label}: ${
          value ?? placeholder ?? ''
        }`}</Text>
        {isOpen ? (
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onValueChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType={keyboardType}
            placeholder={placeholder}
          />
        ) : null}
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
    borderColor: '#039be5',
    backgroundColor: WHITE,
  },
  label: {
    fontSize: 15,
    color: 'black',
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
  },
});

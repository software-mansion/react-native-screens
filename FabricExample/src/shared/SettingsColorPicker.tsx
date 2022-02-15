import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import {WHITE} from '../colors';

type Props = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  colors: ReadonlyArray<string>;
};

export const SettingsColorPicker = ({
  label,
  value,
  onValueChange,
  colors,
}: Props): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
      <View style={styles.container}>
        <View style={styles.preview}>
          <Text style={styles.label}>{`${label}: `}</Text>
          <View style={[styles.valueSquare, {backgroundColor: value}]} />
        </View>
        {isOpen ? (
          <View style={styles.edit}>
            {colors.map(color => (
              <TouchableHighlight
                key={color}
                underlayColor={WHITE}
                onPress={() => onValueChange(color)}>
                <View style={[styles.colorSquare, {backgroundColor: color}]} />
              </TouchableHighlight>
            ))}
            <TextInput
              style={styles.input}
              value={value}
              onChangeText={onValueChange}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
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
  preview: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    borderWidth: 1,
    flex: 1,
    borderColor: 'black',
  },
  edit: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginTop: 5,
  },
  colorSquare: {
    width: 30,
    height: 30,
    marginRight: 10,
    borderColor: '#00000033',
    borderWidth: 1,
  },
  valueSquare: {
    width: 20,
    height: 20,
    borderColor: '#00000033',
    borderWidth: 1,
  },
});

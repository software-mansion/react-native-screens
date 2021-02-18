import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

export const MenuItem = ({title, onPress}: Props): JSX.Element => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.chevron}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  title: {
    color: 'black',
  },
  chevron: {
    fontWeight: 'bold',
    color: 'black',
  },
});

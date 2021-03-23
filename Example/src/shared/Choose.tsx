import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const Choose = (): JSX.Element => {
  const navigation = useNavigation();
  return (
    <View>
      <Text style={styles.heading}>Choose wisely</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'dodgerblue'}}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Blue pill</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'crimson'}}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Red pill</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    height: 40,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
});

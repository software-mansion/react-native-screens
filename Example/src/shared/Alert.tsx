import React from 'react';
import {Text, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';

export const Alert = (): JSX.Element => {
  const navigation = useNavigation();
  const backgrounds = [
    'darkviolet',
    'slateblue',
    'mediumseagreen',
    'orange',
    'indianred',
  ];
  const bgColor = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{...styles.alert, backgroundColor: bgColor}}>
      <Text style={styles.text}>Oh, hi! 👋</Text>
      <Text style={styles.text}>Tap me</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  alert: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: Dimensions.get('screen').width - 40,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

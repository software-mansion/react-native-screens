import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const CardView = () => {
  return <View style={styles.container} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'blue',
  },
});

export default CardView;

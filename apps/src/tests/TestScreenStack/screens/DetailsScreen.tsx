import React from 'react';
import { Button, StyleSheet, View } from 'react-native';
import { useStackNavigation } from '../../../shared/gamma/containers/stack/StackContainer';

export default function DetailsScreen() {
  const navigation = useStackNavigation();
  return (
    <View style={styles.container}>
      <View style={{ height: 100, width: 100, backgroundColor: 'blue' }}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

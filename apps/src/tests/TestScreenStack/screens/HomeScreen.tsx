import React from 'react';
import {
  StackContainer,
  useStackNavigation,
} from '../../../shared/gamma/containers/stack/StackContainer';

import { Button, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const navigation = useStackNavigation();
  return (
    <View style={styles.container}>
      <View style={{ height: 100, width: 100, backgroundColor: 'red' }}></View>
      <Button
        title="Go to Details"
        onPress={() => navigation.push('details')}
      />
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

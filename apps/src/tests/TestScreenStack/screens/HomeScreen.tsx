import React from 'react';
import { useStackNavigation } from '../../../shared/gamma/containers/stack/StackContainer';

import { StyleSheet, View, Text } from 'react-native';
import { GlassButton } from '../components/GlassButton';

export default function HomeScreen() {
  const navigation = useStackNavigation();
  return (
    <View style={styles.container}>
      <View style={{ height: 100, width: 100, backgroundColor: 'red' }}></View>

      <GlassButton onPress={() => navigation.push('details')}>
        <Text>Go to Details</Text>
      </GlassButton>
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

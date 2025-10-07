import React from 'react';
import { useStackNavigation } from '../../../shared/gamma/containers/stack/StackContainer';

import { StyleSheet, View, Text } from 'react-native';
import { GlassButton } from '../components/GlassButton';
import { Type } from 'lucide-react-native';

export default function HomeScreen() {
  const navigation = useStackNavigation();
  return (
    <View style={styles.container}>
      <GlassButton>
        <Type color="white" size={24} />
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
  textButton: {
    color: 'white',
  },
});

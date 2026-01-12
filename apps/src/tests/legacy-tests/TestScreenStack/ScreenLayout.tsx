import React from 'react';
import { View, StyleSheet, Text, Button } from 'react-native';
import Colors from '../../../shared/styling/Colors';
import { useStackNavigation } from '../../../shared/gamma/containers/stack/StackContainer';

export function ScreenLayout({ children }: { children: React.ReactNode }) {
  const navigation = useStackNavigation();

  console.log(
    `ScreenLayout render screen ${navigation.name} with id ${navigation.screenKey} and lifecycle ${navigation.lifecycleState}`,
  );

  return (
    <View style={styles.container}>
      <Text>Screen name: {navigation.name}</Text>
      <Button onPress={navigation.pop} title="Pop" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BlueLight40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

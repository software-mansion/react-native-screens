import React from "react";
import { useSafeAreaConfig } from "../hooks/useSafeAreaConfig";
import { Button, StyleSheet, View } from "react-native";

export function SafeAreaConfigurationButtons(): React.ReactElement {
  const { mutations } = useSafeAreaConfig();

  const toggleLeft = React.useCallback(() => {
    mutations.toggleLeft(prev => !prev);
  }, [mutations]);

  const toggleTop = React.useCallback(() => {
    mutations.toggleTop(prev => !prev);
  }, [mutations]);

  const toggleRight = React.useCallback(() => {
    mutations.toggleRight(prev => !prev);
  }, [mutations]);

  const toggleBottom = React.useCallback(() => {
    mutations.toggleBottom(prev => !prev);
  }, [mutations]);

  return (
    <View style={[styles.centered, { maxWidth: '60%' }]}>
      <Button title="Toggle left" onPress={toggleLeft} />
      <Button title="Toggle top" onPress={toggleTop} />
      <Button title="Toggle right" onPress={toggleRight} />
      <Button title="Toggle bottom" onPress={toggleBottom} />
    </View>
  )
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});


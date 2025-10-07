import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function CommentColumn() {
  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <Text style={styles.text}>Primary column</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});

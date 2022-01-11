import React from 'react';
import NativeScreenStackHeaderSubview from './ScreenStackHeaderSubviewNativeComponent';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  headerSubview: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ScreenStackHeaderSubview(props) {
  return (
    <NativeScreenStackHeaderSubview {...props} style={styles.headerSubview} />
  );
}

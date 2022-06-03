import React from 'react';
import SearchBarNativeComponent from './SearchBarNativeComponent';
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

function SearchBar(props) {
  return <SearchBarNativeComponent {...props} style={styles.headerSubview} />;
}

export default SearchBar;

import React from 'react';
import SearchBarNativeComponent from './SearchBarNativeComponent';

function SearchBar(props) {
  return (
    <SearchBarNativeComponent {...props} style={[{ flex: 1 }, props.style]} />
  );
}

export default SearchBar;

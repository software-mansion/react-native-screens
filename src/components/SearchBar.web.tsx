import { View, ViewProps } from 'react-native';
import React from 'react';

export const NativeSearchBar = View;
export const NativeSearchBarCommands = View;

export const SearchBarBackground = (
  props: React.PropsWithChildren<ViewProps>
): JSX.Element => <View {...props} />;

export default View;

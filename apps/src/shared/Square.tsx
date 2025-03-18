import React from 'react';
import { View } from 'react-native';

interface Props {
  color?: string;
  size?: number;
  testID?: string;
}

export const Square = ({
  size = 100,
  color = 'red',
  testID,
}: Props): React.JSX.Element => (
  <View style={{ width: size, height: size, backgroundColor: color }} testID={testID} />
);

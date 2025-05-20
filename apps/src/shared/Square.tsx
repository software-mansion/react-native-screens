import React from 'react';
import { ColorValue, View } from 'react-native';
import Colors from './styling/Colors';

interface Props {
  color?: ColorValue;
  size?: number;
  testID?: string;
}

export const Square = ({
  size = 100,
  color = Colors.primary,
  testID,
}: Props): React.JSX.Element => (
  <View style={{ width: size, height: size, backgroundColor: color }} testID={testID} />
);

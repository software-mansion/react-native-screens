import React from 'react';
import { View } from 'react-native';

interface Props {
  color?: string;
  size?: number;
}

export const Square = ({ size = 100, color = 'red' }: Props): JSX.Element => (
  <View style={{ width: size, height: size, backgroundColor: color }} />
);

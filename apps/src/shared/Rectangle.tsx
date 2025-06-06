import React from 'react';
import { ColorValue, View, ViewProps, ViewStyle } from 'react-native';

export interface RectangleProps extends ViewProps {
  color?: ColorValue,
  width?: ViewStyle['width'],
  height?: ViewStyle['height'],
}

export function Rectangle(props: RectangleProps) {
  const { color, width, height, style, ...remainingProps } = props;
  return <View style={[{ backgroundColor: color, width, height }, style]} {...remainingProps} />;
}


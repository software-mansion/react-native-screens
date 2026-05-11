import React from 'react';
import { View } from 'react-native';
import { ScrollViewMarkerProps } from './ScrollViewMarker.types';

export function ScrollViewMarker({
  scrollEdgeEffects: _,
  ...rest
}: ScrollViewMarkerProps) {
  return <View {...rest} />;
}

import React from 'react';
import { View } from 'react-native';
import { ScrollViewMarkerProps } from './ScrollViewMarker.types';

export function ScrollViewMarker({ ios: _, ...rest }: ScrollViewMarkerProps) {
  return <View {...rest} />;
}

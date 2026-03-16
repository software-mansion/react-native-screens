import React from 'react';
import type { ReactNativeElement, ViewProps } from 'react-native';
import { type NativeProps } from '../../../fabric/gamma/stack/StackHostNativeComponent';

export type StackHostProps = {
  children: ViewProps['children'];
  ref?: React.RefObject<
    (React.Component<NativeProps> & ReactNativeElement) | null
  >; // TODO: Work on these types
};

import React from 'react';
import InlineModalProviderNativeComponent from '../../../fabric/gamma/inline-modal/InlineModalProviderNativeComponent';
import type { InlineModalProviderProps } from './InlineModalProvider.types';

export function InlineModalProvider(props: InlineModalProviderProps) {
  return <InlineModalProviderNativeComponent {...props} />;
}

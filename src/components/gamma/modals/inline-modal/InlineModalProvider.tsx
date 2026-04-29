import React from 'react';
import InlineModalProviderNativeComponent from '../../../../fabric/gamma/modals/inline-modal/InlineModalProviderNativeComponent';
import type { InlineModalProviderProps } from './InlineModalProvider.types';

export function InlineModalProvider(props: InlineModalProviderProps) {
  return <InlineModalProviderNativeComponent {...props} />;
}

import React from 'react';
import ContainedModalProviderNativeComponent from '../../../../fabric/gamma/modals/contained-modal/ContainedModalProviderNativeComponent';
import { ContainedModalProviderProps } from './ContainedModalProvider.types';

export function ContainedModalProvider(props: ContainedModalProviderProps) {
  return <ContainedModalProviderNativeComponent {...props} />;
}

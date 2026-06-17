import React from 'react';
import ContainedModalProviderHostNativeComponent from '../../../../fabric/gamma/modals/contained-modal/ContainedModalProviderHostNativeComponent';
import type { ContainedModalProviderProps } from './ContainedModalProvider.types';

export function ContainedModalProvider(props: ContainedModalProviderProps) {
  const { children, style, ...rest } = props;

  return (
    <ContainedModalProviderHostNativeComponent style={style} {...rest}>
      {children}
    </ContainedModalProviderHostNativeComponent>
  );
}

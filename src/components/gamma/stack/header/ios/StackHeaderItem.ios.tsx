import React from 'react';
import StackHeaderItemIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import { StackHeaderItemProps } from './StackHeaderItem.ios.types';

export default function StackHeaderItem(props: StackHeaderItemProps) {
  const { component: ItemComponent, ...rest } = props;
  return (
    <StackHeaderItemIOSNativeComponent {...rest}>
      {ItemComponent && <ItemComponent />}
    </StackHeaderItemIOSNativeComponent>
  );
}

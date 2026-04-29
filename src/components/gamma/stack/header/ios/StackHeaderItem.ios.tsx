import React from 'react';
import StackHeaderItemIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import { StackHeaderItemProps } from './StackHeaderItem.ios.types';

export default function StackHeaderItem(props: StackHeaderItemProps) {
  const { itemKey, component: ItemComponent, ...rest } = props;
  return (
    <StackHeaderItemIOSNativeComponent key={itemKey} {...rest}>
      {ItemComponent && <ItemComponent />}
    </StackHeaderItemIOSNativeComponent>
  );
}

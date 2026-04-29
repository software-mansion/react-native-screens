import React from 'react';
import StackHeaderItemSpacerIOSNativeComponent from '../../../../../fabric/gamma/stack/StackHeaderItemSpacerIOSNativeComponent';
import { StackHeaderItemSpacerProps } from './StackHeaderItemSpacer.ios.types';

export default function StackHeaderItemSpacer(
  props: StackHeaderItemSpacerProps,
) {
  const { itemKey, ...rest } = props;
  return <StackHeaderItemSpacerIOSNativeComponent key={itemKey} {...rest} />;
}

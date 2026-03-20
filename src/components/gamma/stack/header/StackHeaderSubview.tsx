import React from 'react';
import { StackHeaderSubviewProps } from './StackHeaderSubview.types';
import StackHeaderSubviewNativeComponent from '../../../../fabric/gamma/stack/StackHeaderSubviewNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackHeaderSubview(props: StackHeaderSubviewProps) {
  const { children, ...filteredProps } = props;
  return (
    <StackHeaderSubviewNativeComponent
      collapsable={false}
      style={{ position: 'absolute', left: 0, top: 0 }}
      {...filteredProps}>
      {children}
    </StackHeaderSubviewNativeComponent>
  );
}

export default StackHeaderSubview;

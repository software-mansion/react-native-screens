import React from 'react';
import { ViewProps } from 'react-native';

import HeaderSubviewContentWrapperNativeComponent from '../fabric/HeaderSubviewContentWrapperNativeComponent';

function HeaderSubviewContentWrapper(props: ViewProps) {
  return (
    <HeaderSubviewContentWrapperNativeComponent collapsable={false} {...props}>
      {props.children}
    </HeaderSubviewContentWrapperNativeComponent>
  );
}

export default HeaderSubviewContentWrapper;

import React from 'react';
import { Platform, View, ViewProps } from 'react-native';

import HeaderSubviewContentWrapperNativeComponent from '../fabric/HeaderSubviewContentWrapperNativeComponent';

function HeaderSubviewContentWrapper(props: ViewProps) {
  if (Platform.OS === 'android') {
    return (
      <View collapsable={false} {...props}>
        {props.children}
      </View>
    );
  }
  return (
    <HeaderSubviewContentWrapperNativeComponent collapsable={false} {...props}>
      {props.children}
    </HeaderSubviewContentWrapperNativeComponent>
  );
}

export default HeaderSubviewContentWrapper;

import React from 'react';
import { ViewProps } from 'react-native';
import ScreenFooterNativeComponent from '../fabric/ScreenFooterNativeComponent';

/**
 * Unstable API
 */
function ScreenFooter(props: ViewProps) {
  return <ScreenFooterNativeComponent {...props} />;
}

export default ScreenFooter;

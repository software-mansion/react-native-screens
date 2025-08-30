import React from 'react';
import { ViewProps } from 'react-native';
import ZoomTransitionSourceNativeComponent from '../fabric/ZoomTransitionSourceNativeComponent';

export interface ZoomTransitionSourceProps extends ViewProps {
  transitionTag: string;
}

function ZoomTransitionSource(props: ZoomTransitionSourceProps) {
  return <ZoomTransitionSourceNativeComponent {...props} collapsable={false} />;
}

export default ZoomTransitionSource;

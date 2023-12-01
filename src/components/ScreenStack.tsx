import React from 'react';
import { ScreenStackProps } from '../types';
import DelayedFreeze from './helpers/DelayedFreeze';
import { freezeEnabled } from '../core';

import ScreenStackNativeComponent from '../fabric/ScreenStackNativeComponent';
const NativeScreenStack: React.ComponentType<ScreenStackProps> =
  ScreenStackNativeComponent as any;

const ScreenStack = (props: ScreenStackProps) => {
  const { children, ...rest } = props;
  const size = React.Children.count(children);
  // freezes all screens except the top one
  const childrenWithFreeze = React.Children.map(children, (child, index) => {
    // @ts-expect-error it's either SceneView in v6 or RouteView in v5
    const { props, key } = child;
    const descriptor = props?.descriptor ?? props?.descriptors?.[key];
    const isFreezeEnabled =
      descriptor?.options?.freezeOnBlur ?? freezeEnabled();

    return (
      <DelayedFreeze freeze={isFreezeEnabled && size - index > 1}>
        {child}
      </DelayedFreeze>
    );
  });

  return <NativeScreenStack {...rest}>{childrenWithFreeze}</NativeScreenStack>;
};

export default ScreenStack;

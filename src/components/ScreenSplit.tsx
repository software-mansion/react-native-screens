import React from 'react';
import { ScreenSplitProps, freezeEnabled } from 'react-native-screens';
import DelayedFreeze from './helpers/DelayedFreeze';

// Native components
import ScreenSplitNativeComponent from '../fabric/ScreenSplitNativeComponent';
const NativeScreenSplit: React.ComponentType<ScreenSplitProps> =
  ScreenSplitNativeComponent as any;

function ScreenSplit(props: ScreenSplitProps) {
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

  return <NativeScreenSplit {...rest}>{childrenWithFreeze}</NativeScreenSplit>;
}

export default ScreenSplit;

import React from 'react';
import { ScreenStackProps, freezeEnabled } from 'react-native-screens';
import DelayedFreeze from './helpers/DelayedFreeze';

// Native components
import ScreenStackNativeComponent from '../fabric/ScreenStackNativeComponent';
const NativeScreenStack: React.ComponentType<ScreenStackProps> =
  ScreenStackNativeComponent as any;

function ScreenStack(props: ScreenStackProps) {
  const { children, gestureDetectorBridge, ...rest } = props;
  const ref = React.useRef(null);
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

  React.useEffect(() => {
    if (gestureDetectorBridge) {
      gestureDetectorBridge.current.stackUseEffectCallback(ref);
    }
  });
  return (
    <NativeScreenStack {...rest} ref={ref}>
      {childrenWithFreeze}
    </NativeScreenStack>
  );
}

export default ScreenStack;

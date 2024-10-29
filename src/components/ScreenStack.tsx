'use client';

import React from 'react';
import { GestureDetectorBridge, GHContext, ScreenStackProps } from '../types';
import { freezeEnabled } from '../core';
import DelayedFreeze from './helpers/DelayedFreeze';
import warnOnce from 'warn-once';

// Native components
import ScreenStackNativeComponent, {
  NativeProps,
} from '../fabric/ScreenStackNativeComponent';

function isFabric() {
  return 'nativeFabricUIManager' in global;
}

function ScreenStack(props: ScreenStackProps) {
  const {
    goBackGesture,
    screensRefs,
    currentScreenId,
    transitionAnimation,
    screenEdgeGesture,
    children,
    ...rest
  } = props;

  console.log('<------------------- ScreenStack ------------------->');
  const ref = React.useRef(null);
  const size = React.Children.count(children);
  const ScreenGestureDetector = React.useContext(GHContext);
  const gestureDetectorBridge = React.useRef<GestureDetectorBridge>({
    stackUseEffectCallback: _stackRef => {
      // this method will be overriden in GestureDetector
    },
  });

  // freezes all screens except the top one
  const childrenWithFreeze = React.Children.map(children, (child, index) => {
    // @ts-expect-error it's either SceneView in v6 or RouteView in v5
    const { props, key } = child;
    const descriptor = props?.descriptor ?? props?.descriptors?.[key];
    const isFreezeEnabled =
      descriptor?.options?.freezeOnBlur ?? freezeEnabled();

    // On Fabric, when screen is frozen, animated and reanimated values are not updated
    // due to component being unmounted. To avoid this, we don't freeze the previous screen there
    const freezePreviousScreen = isFabric()
      ? size - index > 2
      : size - index > 1;

    return (
      <DelayedFreeze freeze={isFreezeEnabled && freezePreviousScreen}>
        {child}
      </DelayedFreeze>
    );
  });

  React.useEffect(() => {
    gestureDetectorBridge.current.stackUseEffectCallback(ref);
  });

  if (
    goBackGesture !== undefined &&
    screensRefs !== undefined &&
    currentScreenId !== undefined
  ) {
    return (
      <ScreenGestureDetector
        gestureDetectorBridge={gestureDetectorBridge}
        goBackGesture={goBackGesture}
        transitionAnimation={transitionAnimation}
        screenEdgeGesture={screenEdgeGesture ?? false}
        screensRefs={screensRefs}
        currentScreenId={currentScreenId}>
        {/* TODO: fix types */}
        <ScreenStackNativeComponent
          /**
           * This messy override is to conform NativeProps used by codegen and
           * our Public API. To see reasoning go to this PR:
           * https://github.com/software-mansion/react-native-screens/pull/2423#discussion_r1810616995
           */
          {...rest}
          onFinishTransitioning={
            props.onFinishTransitioning as NativeProps['onFinishTransitioning']
          }
          ref={ref}>
          {childrenWithFreeze}
        </ScreenStackNativeComponent>
      </ScreenGestureDetector>
    );
  }

  const isGestureDetectorProviderNotDetected =
    ScreenGestureDetector.name !== 'GHWrapper' && goBackGesture !== undefined;
  const isGestureDetectorNotConfiguredProperly =
    goBackGesture !== undefined &&
    screensRefs === undefined &&
    currentScreenId === undefined;

  warnOnce(
    isGestureDetectorProviderNotDetected,
    'Cannot detect GestureDetectorProvider in a screen that uses `goBackGesture`. Make sure your navigator is wrapped in GestureDetectorProvider.',
  );
  warnOnce(
    isGestureDetectorNotConfiguredProperly,
    'Custom Screen Transition require screensRefs and currentScreenId to be provided.',
  );

  return (
    <ScreenStackNativeComponent
      {...rest}
      /**
       * This messy override is to conform NativeProps used by codegen and
       * our Public API. To see reasoning go to this PR:
       * https://github.com/software-mansion/react-native-screens/pull/2423#discussion_r1810616995
       */
      onFinishTransitioning={
        props.onFinishTransitioning as NativeProps['onFinishTransitioning']
      }
      ref={ref}>
      {childrenWithFreeze}
    </ScreenStackNativeComponent>
  );
}

export default ScreenStack;

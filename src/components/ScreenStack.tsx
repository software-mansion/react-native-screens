'use client';

import React, { PropsWithChildren } from 'react';
import {
  GestureDetectorBridge,
  ScreensRefsHolder,
  GestureProviderProps,
  GoBackGesture,
  ScreenStackProps,
} from '../types';
import { GHContext, RNSScreensRefContext } from '../contexts';
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

const assertGHProvider = (
  ScreenGestureDetector: (
    props: PropsWithChildren<GestureProviderProps>,
  ) => React.JSX.Element,
  goBackGesture: GoBackGesture | undefined,
) => {
  const isGestureDetectorProviderNotDetected =
    ScreenGestureDetector.name !== 'GHWrapper' && goBackGesture !== undefined;

  warnOnce(
    isGestureDetectorProviderNotDetected,
    'Cannot detect GestureDetectorProvider in a screen that uses `goBackGesture`. Make sure your navigator is wrapped in GestureDetectorProvider.',
  );
};

const assertCustomScreenTransitionsProps = (
  screensRefs: ScreenStackProps['screensRefs'],
  currentScreenId: ScreenStackProps['currentScreenId'],
  goBackGesture: ScreenStackProps['goBackGesture'],
) => {
  const isGestureDetectorNotConfiguredProperly =
    goBackGesture !== undefined &&
    screensRefs === null &&
    currentScreenId === undefined;

  warnOnce(
    isGestureDetectorNotConfiguredProperly,
    'Custom Screen Transition require screensRefs and currentScreenId to be provided.',
  );
};

function ScreenStack(props: ScreenStackProps) {
  const {
    goBackGesture,
    screensRefs: passedScreenRefs, // TODO: For compatibility with v5, remove once v5 is removed
    currentScreenId,
    transitionAnimation,
    screenEdgeGesture,
    onFinishTransitioning,
    children,
    ...rest
  } = props;

  const screensRefs = React.useRef<ScreensRefsHolder>(
    passedScreenRefs?.current ?? {},
  );
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

  assertGHProvider(ScreenGestureDetector, goBackGesture);

  assertCustomScreenTransitionsProps(
    screensRefs,
    currentScreenId,
    goBackGesture,
  );

  return (
    <RNSScreensRefContext.Provider value={screensRefs}>
      <ScreenGestureDetector
        gestureDetectorBridge={gestureDetectorBridge}
        goBackGesture={goBackGesture}
        transitionAnimation={transitionAnimation}
        screenEdgeGesture={screenEdgeGesture ?? false}
        screensRefs={screensRefs}
        currentScreenId={currentScreenId}>
        <ScreenStackNativeComponent
          {...rest}
          /**
           * This messy override is to conform NativeProps used by codegen and
           * our Public API. To see reasoning go to this PR:
           * https://github.com/software-mansion/react-native-screens/pull/2423#discussion_r1810616995
           */
          onFinishTransitioning={
            onFinishTransitioning as NativeProps['onFinishTransitioning']
          }
          ref={ref}>
          {childrenWithFreeze}
        </ScreenStackNativeComponent>
      </ScreenGestureDetector>
    </RNSScreensRefContext.Provider>
  );
}

export default ScreenStack;

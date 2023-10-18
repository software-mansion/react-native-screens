import React from 'react';
import { Dimensions, Platform, findNodeHandle } from 'react-native';
import { NativeScreensModule } from 'react-native-screens';

import { GestureDetector, Gesture, PanGestureHandlerEventPayload, GestureUpdateEvent } from 'react-native-gesture-handler';
import Animated, { SharedValue, runOnJS, useAnimatedRef, useSharedValue, updateProps, measure, MeasuredDimensions } from 'react-native-reanimated';

type AnimatedScreenTransition = {
  topScreenFrame: (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>, 
    screenSize: MeasuredDimensions,
  ) => Record<string, unknown>,
  belowTopScreenFrame: (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>, 
    screenSize: MeasuredDimensions,
  ) => Record<string, unknown>,
};

const ReanimatedAnimations: 
  Record<string, AnimatedScreenTransition>
= {
  horizontal: {
    topScreenFrame: (event) => {
      'worklet';
      return {
        transform: [
          { translateX: event.translationX },
        ],
      };
    },
    belowTopScreenFrame: (event, screenSize) => {
      'worklet';
      return {
        transform: [
          { translateX: (event.translationX - screenSize.width) * 0.3 },
        ],
      };
    },
  },
  vertical: {
    topScreenFrame: (event) => {
      'worklet';
      return {
        transform: [
          { translateY: event.translationY },
        ],
      };
    },
    belowTopScreenFrame: (event) => {
      'worklet';
      return {
        transform: [
          { rotate: 3 * event.translationY + 'deg' },
        ],
      };
    },
  },
  // twoDimensional: (event) => {
  //   'worklet';
  //   return {
  //     transform: [
  //       { translateX: event.translationX },
  //       { translateY: event.translationY },
  //     ],
  //   };
  // },
  // fade: (event) => {
  //   'worklet';
  //   return {
  //     opacity: 1 - Math.abs(event.translationX / Dimensions.get('window').width),
  //   };
  // },
}
type GoBackGesture = 'swipeRight' | 'swipeLeft' | 'swipeUp' | 'swipeDown';
type ScreenTransitionConfig = {
  stackTag: number;
  belowTopScreenTag: number;
  topScreenTag: number;
  screenTransition: AnimatedScreenTransition;
  isSwipeGesture: boolean;
  sharedEvent: SharedValue<GestureUpdateEvent<PanGestureHandlerEventPayload>>;
  startingGesturePosition: SharedValue<GestureUpdateEvent<PanGestureHandlerEventPayload>>;
  onFinishAnimation?: () => void;
  isTransitionCanceled: boolean;
  goBackGesture: GoBackGesture;
  screenDimensions: MeasuredDimensions;
};

function applyStyle(
  screenTransitionConfig: ScreenTransitionConfig, 
  event: GestureUpdateEvent<PanGestureHandlerEventPayload>
) {
  'worklet';
  const screenSize = screenTransitionConfig.screenDimensions;

  const topScreenTag = screenTransitionConfig.topScreenTag;
  const topScreenFrame = screenTransitionConfig.screenTransition.topScreenFrame;
  const topStyle = topScreenFrame(event, screenSize);
  const topScreenDescriptor = {value: [{tag: topScreenTag, name: 'RCTView'}]};
  updateProps(topScreenDescriptor as any, topStyle, null as any);

  const belowTopScreenTag = screenTransitionConfig.belowTopScreenTag;
  const belowTopScreenFrame = screenTransitionConfig.screenTransition.belowTopScreenFrame;
  const belowTopStyle = belowTopScreenFrame(event, screenSize);
  const belowTopScreenDescriptor = {value: [{tag: belowTopScreenTag, name: 'RCTView'}]};
  updateProps(belowTopScreenDescriptor as any, belowTopStyle, null as any);
};

const reanimated = {
  startScreenTransition: (screenTransitionConfig: ScreenTransitionConfig) => {
    'worklet';
    const sharedEvent = screenTransitionConfig.sharedEvent;
    sharedEvent.addListener(screenTransitionConfig.stackTag, () => {
      'worklet';
      applyStyle(screenTransitionConfig, sharedEvent.value);
    });
  },
  finishScreenTransition: (screenTransitionConfig: ScreenTransitionConfig) => {
    'worklet';
    screenTransitionConfig.sharedEvent.removeListener(screenTransitionConfig.stackTag);
    const event = screenTransitionConfig.sharedEvent.value;
    const isTransitionCanceled = screenTransitionConfig.isTransitionCanceled;
    const goBackGesture = screenTransitionConfig.goBackGesture;

    let step = () => {};
    if (goBackGesture == 'swipeRight') {
      step = () => {
        const screenSize = screenTransitionConfig.screenDimensions;
        let isScreenReachDestination = false;
        if (isTransitionCanceled) {
          event.translationX -= 400 * 0.016;
          if (event.translationX < 0) {
            isScreenReachDestination = true;
            event.translationX = 0;
          }
        } else {
          event.translationX += 400 * 0.016;
          if (event.translationX > screenSize.width) {
            isScreenReachDestination = true;
            event.translationX = screenSize.width;
          }
        }
        applyStyle(screenTransitionConfig, event);
        if (!isScreenReachDestination) {
          requestAnimationFrame(step);
        } else {
          if (screenTransitionConfig.onFinishAnimation) {
            screenTransitionConfig.onFinishAnimation();
          }
        }
      };
    }

    if (goBackGesture == 'swipeLeft') {
      step = () => {
        const screenSize = screenTransitionConfig.screenDimensions;
        let isScreenReachDestination = false;
        if (isTransitionCanceled) {
          event.translationX += 400 * 0.016;
          if (event.translationX > 0) {
            isScreenReachDestination = true;
            event.translationX = 0;
          }
        } else {
          event.translationX -= 400 * 0.016;
          if (event.translationX < -screenSize.width) {
            isScreenReachDestination = true;
            event.translationX = -screenSize.width;
          }
        }
        applyStyle(screenTransitionConfig, event);
        if (!isScreenReachDestination) {
          requestAnimationFrame(step);
        } else {
          if (screenTransitionConfig.onFinishAnimation) {
            screenTransitionConfig.onFinishAnimation();
          }
        }
      };
    }

    if (goBackGesture == 'swipeUp') {
      step = () => {
        console.log('step', event.translationY, isTransitionCanceled);
        const screenSize = screenTransitionConfig.screenDimensions;
        let isScreenReachDestination = false;
        if (isTransitionCanceled) {
          event.translationY += 400 * 0.016;
          if (event.translationY > 0) {
            isScreenReachDestination = true;
            event.translationY = 0;
          }
        } else {
          event.translationY -= 400 * 0.016;
          if (event.translationY < -screenSize.height) {
            isScreenReachDestination = true;
            event.translationY = -screenSize.height;
          }
        }
        applyStyle(screenTransitionConfig, event);
        if (!isScreenReachDestination) {
          requestAnimationFrame(step);
        } else {
          if (screenTransitionConfig.onFinishAnimation) {
            screenTransitionConfig.onFinishAnimation();
          }
        }
      };
    }

    if (goBackGesture == 'swipeDown') {
      step = () => {
        console.log('step', event.translationX, isTransitionCanceled);
        const screenSize = screenTransitionConfig.screenDimensions;
        let isScreenReachDestination = false;
        if (isTransitionCanceled) {
          event.translationY -= 400 * 0.016;
          if (event.translationY < 0) {
            isScreenReachDestination = true;
            event.translationY = 0;
          }
        } else {
          event.translationY += 400 * 0.016;
          if (event.translationY > screenSize.height) {
            isScreenReachDestination = true;
            event.translationY = screenSize.height;
          }
        }
        applyStyle(screenTransitionConfig, event);
        if (!isScreenReachDestination) {
          requestAnimationFrame(step);
        } else {
          if (screenTransitionConfig.onFinishAnimation) {
            screenTransitionConfig.onFinishAnimation();
          }
        }
      };
    }
    step();

  },
};

const TransitionHandler = ({
  children,
  stackRefWrapper,
  topScreenRef,
  belowTopScreenRef,
}) => {
  const ScreenSize = Dimensions.get('window');
  stackRefWrapper.ref = useAnimatedRef();
  const defaultEvent: GestureUpdateEvent<PanGestureHandlerEventPayload> = {
    absoluteX: 0, 
    absoluteY: 0,
    handlerTag: 0, 
    numberOfPointers: 0, 
    state: 0,
    translationX: 0, 
    translationY: 0, 
    velocityX: 0, 
    velocityY: 0, 
    x: 0, 
    y: 0
  };
  const sharedEvent = useSharedValue(defaultEvent);
  const startingGesturePosition = useSharedValue(defaultEvent);
  let goBackGesture: GoBackGesture = 'swipeRight'; // GESTURE <-----------------------------------
  const screenTransitionConfig = useSharedValue<ScreenTransitionConfig>({
    stackTag: 0,
    belowTopScreenTag: Platform.OS === 'ios' ? 35 : 29,
    topScreenTag: Platform.OS === 'ios' ? 69 : 63,
    sharedEvent,
    startingGesturePosition,
    screenTransition: ReanimatedAnimations.horizontal, 
    isSwipeGesture: true,
    isTransitionCanceled: false,
    goBackGesture,
    screenDimensions: {
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      pageX: 0,
      pageY: 0,
    },
  });

  const startTransition = (stackTag: number) => {
    NativeScreensModule.startTransition(stackTag);
  }
  const updateTransition = (stackTag: number, progress: number) => {
    NativeScreensModule.updateTransition(stackTag, progress);
  }
  const finishTransition = (stackTag: number, canceled: boolean) => {
    NativeScreensModule.finishTransition(stackTag, canceled);
  }
  const getTags = () => {
    console.log(stackRefWrapper.ref.current._children.map((screen: any) => findNodeHandle(screen)));
  }
  let panGesture = Gesture.Pan()
    .onStart((event) => {
      // runOnJS(getTags)();
      const screenSize: MeasuredDimensions = measure((() => {
        'worklet';
        return screenTransitionConfig.value.topScreenTag;
      }) as any)!;
      sharedEvent.value = defaultEvent;
      const stackTag = stackRefWrapper.ref();
      runOnJS(startTransition)(stackTag);
      screenTransitionConfig.value.stackTag = stackTag;
      screenTransitionConfig.value.screenDimensions = screenSize;
      startingGesturePosition.value = event;
      reanimated.startScreenTransition(screenTransitionConfig.value);
    })
    .onUpdate(event => {
      console.log(event.translationX, event.translationY);
      if (goBackGesture === 'swipeRight' && event.translationX < 0) {
        event.translationX = 0;
      } else if (goBackGesture === 'swipeLeft' && event.translationX > 0) {
        event.translationX = 0;
      } else if (goBackGesture === 'swipeDown' && event.translationY < 0) {
        event.translationY = 0;
      } else if (goBackGesture === 'swipeUp' && event.translationY > 0) {
        event.translationY = 0;
      }

      let progress = 0;
      if (goBackGesture === 'swipeRight') {
        const screenWidth = screenTransitionConfig.value.screenDimensions.width;
        progress = event.translationX / (screenWidth - startingGesturePosition.value.absoluteX);
      } else if (goBackGesture === 'swipeLeft') {
        progress = -1 * event.translationX / startingGesturePosition.value.absoluteX;
      } else if (goBackGesture === 'swipeDown') {
        const screenHeight = screenTransitionConfig.value.screenDimensions.height;
        progress = -1 * event.translationY / (screenHeight - startingGesturePosition.value.absoluteY);
      } else if (goBackGesture === 'swipeUp') {
        progress = event.translationY / startingGesturePosition.value.absoluteY;
      }
      sharedEvent.value = event;
      runOnJS(updateTransition)(
        screenTransitionConfig.value.stackTag,
        progress
      );
    })
    .onEnd((event) => {
      const screenSize: MeasuredDimensions = measure((() => {
        'worklet';
        return screenTransitionConfig.value.topScreenTag;
      }) as any)!;
      let isTransitionCanceled = false;
      if (goBackGesture === 'swipeRight' || goBackGesture === 'swipeLeft') {
        isTransitionCanceled = Math.abs(event.translationX + event.velocityX * 0.3) < (screenSize.width / 2);
      } else if (goBackGesture === 'swipeDown' || goBackGesture === 'swipeUp') {
        isTransitionCanceled = Math.abs(event.translationY + event.velocityY * 0.3) < (screenSize.height / 2);
      }
      screenTransitionConfig.value.onFinishAnimation = () => runOnJS(finishTransition)(
        screenTransitionConfig.value.stackTag, 
        isTransitionCanceled
      );
      screenTransitionConfig.value.isTransitionCanceled = isTransitionCanceled;
      reanimated.finishScreenTransition(screenTransitionConfig.value);
    });

  const HIT_SLOP_SIZE = 50;
  if (goBackGesture === 'swipeRight') {
    panGesture = panGesture
      .activeOffsetX(20)
      .hitSlop({ left: 0, top: 0, width: HIT_SLOP_SIZE });
  } else if (goBackGesture === 'swipeLeft') {
    panGesture = panGesture
      .activeOffsetX(-20)
      .hitSlop({ right: 0, top: 0, width: HIT_SLOP_SIZE });
  } else if (goBackGesture === 'swipeDown') {
    panGesture = panGesture
      .activeOffsetY(20)
      .hitSlop({ top: 0, height: ScreenSize.height * 0.2 }); // workaround, because we don't have access to header height
  } else if (goBackGesture === 'swipeUp') {
    panGesture = panGesture
      .activeOffsetY(-20)
      .hitSlop({ bottom: 0, height: HIT_SLOP_SIZE });
  }

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default TransitionHandler;

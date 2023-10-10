import React from 'react';
import { Dimensions, Platform, findNodeHandle } from 'react-native';
import { NativeScreensModule } from 'react-native-screens';

import { GestureDetector, Gesture, PanGestureHandlerEventPayload, GestureUpdateEvent } from 'react-native-gesture-handler';
import Animated, { SharedValue, runOnJS, useAnimatedRef, useSharedValue, updateProps, measure, MeasuredDimensions } from 'react-native-reanimated';

type AnimatedScreenTransition = {
  computeFrame: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) 
    => Record<string, unknown>,
  getProgress: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>, screenDimensions: MeasuredDimensions) 
    => number,
  shouldFinishTransition: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>, screenDimensions: MeasuredDimensions)
    => boolean,
};

const ReanimatedAnimations: 
  Record<string, AnimatedScreenTransition> 
= {
  default: {
    computeFrame: (event) => {
      'worklet';
      return {
        transform: [
          { translateX: event.translationX },
        ],
      };
    },
    getProgress: (event, screenDimensions) => {
      'worklet';
      return event.translationX / screenDimensions.width;
    },
    shouldFinishTransition: (event, screenDimensions) => {
      'worklet';
      return (event.translationX + event.velocityX * 0.3) > (screenDimensions.width / 2);
    },
  },
  // vertical: (event) => {
  //   'worklet';
  //   return {
  //     transform: [
  //       { translateY: event.translationY },
  //     ],
  //   };
  // },
  // horizontal: (event) => {
  //   'worklet';
  //   return {
  //     transform: [
  //       { translateX: event.translationX },
  //     ],
  //   };
  // },
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
  sharedEvent: SharedValue<GestureUpdateEvent<PanGestureHandlerEventPayload>>
  onFinishAnimation?: () => void;
  canceled: boolean;
  goBackGesture: GoBackGesture;
  screenDimensions: MeasuredDimensions;
};
const ScreenSize = Dimensions.get('window');
const reanimated = {
  startScreenTransition: (screenTransitionConfig: ScreenTransitionConfig) => {
    'worklet';
    const topScreenTag = screenTransitionConfig.topScreenTag;
    const computeFrame = screenTransitionConfig.screenTransition.computeFrame;
    const sharedEvent = screenTransitionConfig.sharedEvent;
    sharedEvent.addListener(screenTransitionConfig.stackTag, () => {
      'worklet';
      const style = computeFrame(sharedEvent.value);
      const viewDescriptor = {value: [{tag: topScreenTag, name: 'RCTView'}]};
      updateProps(viewDescriptor as any, style as any, null as any);
    });
  },
  finishScreenTransition: (screenTransitionConfig: ScreenTransitionConfig) => {
    'worklet';
    screenTransitionConfig.sharedEvent.removeListener(screenTransitionConfig.stackTag);
    // const event = screenTransitionConfig.sharedEvent.value;
    // const isCanceled = screenTransitionConfig.canceled;
    // if (event.absoluteX < ScreenSize.width) {
    //   const step = () => {
    //     console.log('step', screenTransitionConfig.sharedEvent.value.translationX, isCanceled);
    //     const distance = ScreenSize.width - event.translationX;
    //     if (isCanceled) {
    //       screenTransitionConfig.sharedEvent.value.translationX -= 400 * 0.016;
    //     } else {
    //       screenTransitionConfig.sharedEvent.value.translationX += 400 * 0.016;
    //     }
    //     const style = screenTransitionConfig.animation(screenTransitionConfig.sharedEvent.value);
    //     const viewDescriptor = {value: [{tag: screenTransitionConfig.topScreenTag, name: 'RCTView'}]};
    //     updateProps(viewDescriptor, style);
    //     if (distance > 0) {
    //       requestAnimationFrame(step);
    //     } else {
    //       if (screenTransitionConfig.onFinishAnimation) {
    //         screenTransitionConfig.onFinishAnimation();
    //       }
    //     }
    //   };
    //   step();
    // } else if (event.absoluteY < ScreenSize.height) {

    // }

    if (screenTransitionConfig.onFinishAnimation) {
      screenTransitionConfig.onFinishAnimation();
    }
  },
};

const TransitionHandler = ({
  children,
  stackRefWrapper,
  topScreenRef,
  belowTopScreenRef,
}) => {
  // const screenWidth = Dimensions.get('window').width;
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
  const goBackGesture = 'swipeRight';
  const screenTransitionConfig = useSharedValue<ScreenTransitionConfig>({
    stackTag: 0,
    belowTopScreenTag: Platform.OS === 'ios' ? 35 : 29,
    topScreenTag: Platform.OS === 'ios' ? 69 : 63,
    sharedEvent,
    screenTransition: ReanimatedAnimations.default, 
    isSwipeGesture: true,
    canceled: false,
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
    .onStart(() => {
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
      reanimated.startScreenTransition(screenTransitionConfig.value);
    })
    .onUpdate(event => {
      // console.log('update', event, screenTransitionConfig.value.screenDimensions);
      if (goBackGesture === 'swipeRight' && event.translationX < 0) {
        event.translationX = 0;
      } else if (goBackGesture === 'swipeLeft' && event.translationX > 0) {
        event.translationX = 0;
      } else if (goBackGesture === 'swipeDown' && event.translationY > 0) {
        event.translationY = 0;
      } else if (goBackGesture === 'swipeUp' && event.translationY < 0) {
        event.translationY = 0;
      }
      
      sharedEvent.value = event;
      runOnJS(updateTransition)(
        screenTransitionConfig.value.stackTag,
        screenTransitionConfig.value.screenTransition.getProgress(event, screenTransitionConfig.value.screenDimensions)
      );
    })
    .onEnd((event) => {
      const shouldFinishTransition = screenTransitionConfig.value.screenTransition.shouldFinishTransition(
        event, 
        screenTransitionConfig.value.screenDimensions
      );
      screenTransitionConfig.value.onFinishAnimation = () => runOnJS(finishTransition)(
        screenTransitionConfig.value.stackTag, 
        !shouldFinishTransition
      );
      screenTransitionConfig.value.canceled = !shouldFinishTransition;
      reanimated.finishScreenTransition(screenTransitionConfig.value);
    });

  const HIT_SLOP_SIZE = 50;
  if (goBackGesture === 'swipeRight') {
    panGesture = panGesture
      .activeOffsetX(20)
      .hitSlop({left: 0, top: 0, width: HIT_SLOP_SIZE});
  } else if (goBackGesture === 'swipeLeft') {
    panGesture = panGesture
      .activeOffsetX(-20)
      .hitSlop({right: 0, top: 0, width: HIT_SLOP_SIZE});
  } else if (goBackGesture === 'swipeDown') {
    panGesture = panGesture
      .activeOffsetY(20)
      .hitSlop({top: 0, height: ScreenSize.height * 0.2}); // workaround, because we don't have access to header height
  } else if (goBackGesture === 'swipeUp') {
    panGesture = panGesture
      .activeOffsetY(-20)
      .hitSlop({bottom: 0, height: HIT_SLOP_SIZE});
  }

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default TransitionHandler;

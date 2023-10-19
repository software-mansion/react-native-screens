import React from 'react';
import { Dimensions, Platform } from 'react-native';
import { NativeScreensModule } from 'react-native-screens';

import {
  GestureDetector,
  Gesture,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedRef,
  useSharedValue,
  measure,
  MeasuredDimensions,
  ScreenTransition,
  startScreenTransition,
  finishScreenTransition,
} from 'react-native-reanimated';
import type {
  GoBackGesture,
  ScreenTransitionConfig,
} from 'react-native-reanimated';

const TransitionHandler = ({ children, stackRefWrapper }) => {
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
    y: 0,
  };
  const sharedEvent = useSharedValue(defaultEvent);
  const startingGesturePosition = useSharedValue(defaultEvent);
  const goBackGesture: GoBackGesture = 'swipeRight'; // GESTURE <-----------------------------------
  const screenTransitionConfig = useSharedValue<ScreenTransitionConfig>({
    stackTag: 0,
    belowTopScreenTag: Platform.OS === 'ios' ? 35 : 29,
    topScreenTag: Platform.OS === 'ios' ? 69 : 63,
    sharedEvent,
    startingGesturePosition,
    screenTransition: ScreenTransition.horizontal,
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
  };
  const updateTransition = (stackTag: number, progress: number) => {
    NativeScreensModule.updateTransition(stackTag, progress);
  };
  const finishTransition = (stackTag: number, canceled: boolean) => {
    NativeScreensModule.finishTransition(stackTag, canceled);
  };
  // const getTags = () => {
  //   console.log(stackRefWrapper.ref.current._children.map((screen: any) => findNodeHandle(screen)));
  // }
  let panGesture = Gesture.Pan()
    .onStart(event => {
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
      startScreenTransition(screenTransitionConfig.value);
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
        progress =
          event.translationX /
          (screenWidth - startingGesturePosition.value.absoluteX);
      } else if (goBackGesture === 'swipeLeft') {
        progress =
          (-1 * event.translationX) / startingGesturePosition.value.absoluteX;
      } else if (goBackGesture === 'swipeDown') {
        const screenHeight =
          screenTransitionConfig.value.screenDimensions.height;
        progress =
          (-1 * event.translationY) /
          (screenHeight - startingGesturePosition.value.absoluteY);
      } else if (goBackGesture === 'swipeUp') {
        progress = event.translationY / startingGesturePosition.value.absoluteY;
      }
      sharedEvent.value = event;
      runOnJS(updateTransition)(
        screenTransitionConfig.value.stackTag,
        progress
      );
    })
    .onEnd(event => {
      const screenSize: MeasuredDimensions = measure((() => {
        'worklet';
        return screenTransitionConfig.value.topScreenTag;
      }) as any)!;
      let isTransitionCanceled = false;
      if (goBackGesture === 'swipeRight' || goBackGesture === 'swipeLeft') {
        isTransitionCanceled =
          Math.abs(event.translationX + event.velocityX * 0.3) <
          screenSize.width / 2;
      } else if (goBackGesture === 'swipeDown' || goBackGesture === 'swipeUp') {
        isTransitionCanceled =
          Math.abs(event.translationY + event.velocityY * 0.3) <
          screenSize.height / 2;
      }
      screenTransitionConfig.value.onFinishAnimation = () =>
        runOnJS(finishTransition)(
          screenTransitionConfig.value.stackTag,
          isTransitionCanceled
        );
      screenTransitionConfig.value.isTransitionCanceled = isTransitionCanceled;
      finishScreenTransition(screenTransitionConfig.value);
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

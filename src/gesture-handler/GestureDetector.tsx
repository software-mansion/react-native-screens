import React from 'react';
import { Dimensions } from 'react-native';

import {
  GestureDetector,
  Gesture,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
} from 'react-native-gesture-handler';
import {
  useAnimatedRef,
  useSharedValue,
  measure,
  MeasuredDimensions,
  startScreenTransition,
  finishScreenTransition,
  ScreenTransition,
  makeMutable,
} from 'react-native-reanimated';
import type { GestureProviderProps } from 'src/native-stack/types';

enum ScreenTransitionCommand {
  Start = 1,
  Update = 2,
  Finish = 3,
}

const TransitionHandler = ({
  children,
  stackRefWrapper,
  goBackGesture,
  transitionAnimation: userTransitionAnimation,
}: GestureProviderProps) => {
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
  const canPerformUpdates = useSharedValue(false);
  let transitionAnimation;
  if (userTransitionAnimation) {
    transitionAnimation = userTransitionAnimation;
    if (!goBackGesture) {
      throw new Error(
        'You have to specify `goBackGesture` when using `transitionAnimation`'
      );
    }
  } else {
    if (goBackGesture === 'swipeRight') {
      transitionAnimation = ScreenTransition.SwipeRight;
    } else if (goBackGesture === 'swipeLeft') {
      transitionAnimation = ScreenTransition.SwipeLeft;
    } else if (goBackGesture === 'swipeDown') {
      transitionAnimation = ScreenTransition.SwipeDown;
    } else if (goBackGesture === 'swipeUp') {
      transitionAnimation = ScreenTransition.SwipeUp;
    } else if (goBackGesture !== undefined) {
      throw new Error('Invalid value of `goBackGesture`: ' + goBackGesture);
    }
  }
  const screenTransitionConfig = makeMutable(
    {
      stackTag: -1,
      belowTopScreenTag: -1,
      topScreenTag: -1,
      sharedEvent,
      startingGesturePosition,
      screenTransition: transitionAnimation as any,
      isSwipeGesture: true,
      isTransitionCanceled: false,
      goBackGesture: goBackGesture ?? 'swipeRight',
      screenDimensions: {
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        pageX: 0,
        pageY: 0,
      },
      onFinishAnimation: () => {
        'worklet';
      },
    },
    true
  );
  let panGesture = Gesture.Pan()
    .onStart(event => {
      sharedEvent.value = defaultEvent;
      const transitionConfig = screenTransitionConfig.value;
      const stackTag = (stackRefWrapper as any).ref();
      const screenTags = (global as any)._manageScreenTransition(
        ScreenTransitionCommand.Start,
        stackTag,
        null
      );
      if (!screenTags) {
        canPerformUpdates.value = false;
        return;
      }
      transitionConfig.topScreenTag = screenTags.topScreenTag;
      transitionConfig.belowTopScreenTag = screenTags.belowTopScreenTag;
      transitionConfig.stackTag = stackTag;
      startingGesturePosition.value = event;
      const screenSize: MeasuredDimensions = measure((() => {
        'worklet';
        return screenTransitionConfig.value.topScreenTag;
      }) as any)!;
      if (screenSize == null) {
        canPerformUpdates.value = false;
        (global as any)._manageScreenTransition(
          ScreenTransitionCommand.Finish,
          stackTag,
          true
        );
        return;
      }
      transitionConfig.screenDimensions = screenSize;
      startScreenTransition(transitionConfig);
      canPerformUpdates.value = true;
    })
    .onUpdate(event => {
      if (!canPerformUpdates.value) {
        return;
      }
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
      const stackTag = screenTransitionConfig.value.stackTag;
      (global as any)._manageScreenTransition(
        ScreenTransitionCommand.Update,
        stackTag,
        progress
      );
    })
    .onEnd(event => {
      if (!canPerformUpdates.value) {
        return;
      }
      const screenSize: MeasuredDimensions = measure((() => {
        'worklet';
        return screenTransitionConfig.value.topScreenTag;
      }) as any)!;
      let isTransitionCanceled = false;
      if (goBackGesture === 'swipeRight' || goBackGesture === 'swipeLeft') {
        isTransitionCanceled =
          Math.abs(event.translationX + event.velocityX * 0.3) <
          screenSize.width / 2;
        console.log(isTransitionCanceled, event.translationX, event.velocityX);
      } else if (goBackGesture === 'swipeDown' || goBackGesture === 'swipeUp') {
        isTransitionCanceled =
          Math.abs(event.translationY + event.velocityY * 0.3) <
          screenSize.height / 2;
      }
      const stackTag = screenTransitionConfig.value.stackTag;
      screenTransitionConfig.value.onFinishAnimation = () => {
        (global as any)._manageScreenTransition(
          ScreenTransitionCommand.Finish,
          stackTag,
          isTransitionCanceled
        );
      };
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
      .hitSlop({ top: 0, height: ScreenSize.height * 0.15 });
    // workaround, because we don't have access to header height
  } else if (goBackGesture === 'swipeUp') {
    panGesture = panGesture
      .activeOffsetY(-20)
      .hitSlop({ bottom: 0, height: HIT_SLOP_SIZE });
  }
  if (!goBackGesture) {
    return <>{children}</>;
  }
  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default TransitionHandler;

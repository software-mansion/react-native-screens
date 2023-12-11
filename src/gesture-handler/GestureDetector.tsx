import React, { useEffect } from 'react';
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
  startScreenTransition,
  finishScreenTransition,
  ScreenTransition,
  makeMutable,
} from 'react-native-reanimated';
import type { GestureProviderProps } from 'src/native-stack/types';
import { getShadowNodeWrapperAndTagFromRef, isFabric } from './fabricUtils';

declare global {
  // eslint-disable-next-line no-var
  var _manageScreenTransition: (
    command: number,
    stackTag: number,
    additionalParam: unknown
  ) => {
    topScreenTag: number;
    belowTopScreenTag: number;
  };
}

type RNScreensTurboModuleType = {
  startTransition: (stackTag: number) => {
    topScreenTag: number;
    belowTopScreenTag: number;
    canStartTransition: boolean;
  };
  updateTransition: (stackTag: number, progress: number) => void;
  finishTransition: (stackTag: number, isCanceled: boolean) => void;
}

const RNScreensTurboModule: RNScreensTurboModuleType = (global as any).RNScreensTurboModule;

const AnimationForGesture = {
  swipeRight: ScreenTransition.SwipeRight,
  swipeLeft: ScreenTransition.SwipeLeft,
  swipeDown: ScreenTransition.SwipeDown,
  swipeUp: ScreenTransition.SwipeUp,
  horizontalSwipe: ScreenTransition.Horizontal,
  verticalSwipe: ScreenTransition.Vertical,
  twoDimensionalSwipe: ScreenTransition.TwoDimensional,
};

const EmptyGestureHandler = Gesture.Tap();

const SupportedGestures = [
  'swipeRight',
  'swipeLeft',
  'swipeDown',
  'swipeUp',
  'horizontalSwipe',
  'verticalSwipe',
  'twoDimensionalSwipe',
];

const DefaultEvent: GestureUpdateEvent<PanGestureHandlerEventPayload> = {
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

const DefaultScreenDimensions = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  pageX: 0,
  pageY: 0,
};

const TransitionHandler = ({
  children,
  stackRef,
  goBackGesture,
  screenEdgeGesture,
  transitionAnimation: userTransitionAnimation,
  screensRefHolder,
  currentRouteKey,
}: GestureProviderProps) => {
  if (stackRef === undefined || stackRef.current === undefined) {
    throw new Error(
      '[RNScreens] A required parameter `stackRef` was not specified.'
    );
  }
  stackRef.current = useAnimatedRef();
  const sharedEvent = useSharedValue(DefaultEvent);
  const startingGesturePosition = useSharedValue(DefaultEvent);
  const canPerformUpdates = useSharedValue(false);
  let transitionAnimation = ScreenTransition.SwipeRight;
  if (userTransitionAnimation) {
    transitionAnimation = userTransitionAnimation;
    if (!goBackGesture) {
      throw new Error(
        '[RNScreens] You have to specify `goBackGesture` when using `transitionAnimation`.'
      );
    }
  } else {
    if (!!goBackGesture && SupportedGestures.includes(goBackGesture)) {
      transitionAnimation = AnimationForGesture[goBackGesture];
    } else if (goBackGesture !== undefined) {
      throw new Error(
        `[RNScreens] Unknown goBackGesture parameter has been specified: ${goBackGesture}.`
      );
    }
  }
  const screenTransitionConfig = makeMutable(
    {
      stackTag: -1,
      belowTopScreenTag: -1,
      topScreenTag: -1,
      sharedEvent,
      startingGesturePosition,
      screenTransition: transitionAnimation,
      isTransitionCanceled: false,
      goBackGesture: goBackGesture ?? 'swipeRight',
      screenDimensions: DefaultScreenDimensions,
      onFinishAnimation: () => {
        'worklet';
      },
    },
    true
  );
  const stackRefCurrent = stackRef.current;
  const screenTagToNodeWrapperUI = makeMutable<any>({}, true);
  const IS_FABRIC = isFabric();
  useEffect(() => {
    if (!IS_FABRIC) {
      return;
    }
    const screenTagToNodeWrapper: any = {};
    for (const key in screensRefHolder.current) {
      const screenRef = screensRefHolder.current[key];
      const screenData = getShadowNodeWrapperAndTagFromRef(screenRef.current);
      screenTagToNodeWrapper[screenData.tag ?? ''] = screenData.shadowNodeWrapper;
    }
    screenTagToNodeWrapperUI.value = screenTagToNodeWrapper;
  }, [currentRouteKey]);

  function onStart(event: GestureUpdateEvent<PanGestureHandlerEventPayload>) {
    'worklet';
    sharedEvent.value = event;
    const transitionConfig = screenTransitionConfig.value;
    const animatedRef = stackRefCurrent;
    if (!animatedRef) {
      throw new Error('[Reanimated] Unable to recognize stack ref.');
    }
    const stackTag = (animatedRef as () => number)();
    const transitionData = RNScreensTurboModule.startTransition(stackTag);
    console.log('transitionData', transitionData);
    if (transitionData.canStartTransition === false) {
      canPerformUpdates.value = false;
      return;
    }
    if (IS_FABRIC) {
      transitionConfig.topScreenTag = screenTagToNodeWrapperUI.value[transitionData.topScreenTag];
      transitionConfig.belowTopScreenTag = screenTagToNodeWrapperUI.value[transitionData.belowTopScreenTag];
      console.log(screenTagToNodeWrapperUI.value);
    } else {
      transitionConfig.topScreenTag = transitionData.topScreenTag;
      transitionConfig.belowTopScreenTag = transitionData.belowTopScreenTag;
    }

    transitionConfig.stackTag = stackTag;
    startingGesturePosition.value = event;
    const animatedRefMock = () => {
      return screenTransitionConfig.value.topScreenTag;
    };
    const screenSize = measure(animatedRefMock as any);
    if (screenSize == null) {
      throw new Error('[Reanimated] Failed to measure screen.');
    }
    if (screenSize == null) {
      canPerformUpdates.value = false;
      RNScreensTurboModule.finishTransition(stackTag, true);
      return;
    }
    transitionConfig.screenDimensions = screenSize;
    startScreenTransition(transitionConfig);
    canPerformUpdates.value = true;
  }

  function onUpdate(event: GestureUpdateEvent<PanGestureHandlerEventPayload>) {
    'worklet';
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
      const screenHeight = screenTransitionConfig.value.screenDimensions.height;
      progress =
        (-1 * event.translationY) /
        (screenHeight - startingGesturePosition.value.absoluteY);
    } else if (goBackGesture === 'swipeUp') {
      progress = event.translationY / startingGesturePosition.value.absoluteY;
    } else if (goBackGesture === 'horizontalSwipe') {
      const screenWidth = screenTransitionConfig.value.screenDimensions.width;
      progress = Math.abs(event.translationX / screenWidth / 2);
    } else if (goBackGesture === 'verticalSwipe') {
      const screenHeight = screenTransitionConfig.value.screenDimensions.height;
      progress = Math.abs(event.translationY / screenHeight / 2);
    } else if (goBackGesture === 'twoDimensionalSwipe') {
      const screenWidth = screenTransitionConfig.value.screenDimensions.width;
      const progressX = Math.abs(event.translationX / screenWidth / 2);
      const screenHeight = screenTransitionConfig.value.screenDimensions.height;
      const progressY = Math.abs(event.translationY / screenHeight / 2);
      progress = Math.max(progressX, progressY);
    }
    sharedEvent.value = event;
    const stackTag = screenTransitionConfig.value.stackTag;
    RNScreensTurboModule.updateTransition(stackTag, progress);
  }

  function onEnd(event: GestureUpdateEvent<PanGestureHandlerEventPayload>) {
    'worklet';
    if (!canPerformUpdates.value) {
      return;
    }
    const screenSize = screenTransitionConfig.value.screenDimensions;
    const distanceX = event.translationX + event.velocityX * 0.3;
    const distanceY = event.translationY + event.velocityY * 0.3;
    const requiredXDistance = screenSize.width / 2;
    const requiredYDistance = screenSize.height / 2;
    let isTransitionCanceled = false;
    if (goBackGesture === 'swipeRight') {
      isTransitionCanceled = distanceX < requiredXDistance;
    } else if (goBackGesture === 'swipeLeft') {
      isTransitionCanceled = -distanceX < requiredXDistance;
    } else if (goBackGesture === 'horizontalSwipe') {
      isTransitionCanceled = Math.abs(distanceX) < requiredXDistance;
    } else if (goBackGesture === 'swipeUp') {
      isTransitionCanceled = distanceY < requiredYDistance;
    } else if (goBackGesture === 'swipeDown') {
      isTransitionCanceled = -distanceY < requiredYDistance;
    } else if (goBackGesture === 'verticalSwipe') {
      isTransitionCanceled = Math.abs(distanceY) < requiredYDistance;
    } else if (goBackGesture === 'twoDimensionalSwipe') {
      const isCanceledHorizontally = Math.abs(distanceX) < requiredXDistance;
      const isCanceledVertically = Math.abs(distanceY) < requiredYDistance;
      isTransitionCanceled = isCanceledHorizontally && isCanceledVertically;
    }
    const stackTag = screenTransitionConfig.value.stackTag;
    screenTransitionConfig.value.onFinishAnimation = () => {
      RNScreensTurboModule.finishTransition(stackTag, isTransitionCanceled);
    };
    screenTransitionConfig.value.isTransitionCanceled = isTransitionCanceled;
    finishScreenTransition(screenTransitionConfig.value);
  }

  let panGesture = Gesture.Pan()
    .onStart(onStart)
    .onUpdate(onUpdate)
    .onEnd(onEnd);

  if (screenEdgeGesture) {
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
        .hitSlop({ top: 0, height: Dimensions.get('window').height * 0.2 });
      // workaround, because we don't have access to header height
    } else if (goBackGesture === 'swipeUp') {
      panGesture = panGesture
        .activeOffsetY(-20)
        .hitSlop({ bottom: 0, height: HIT_SLOP_SIZE });
    }
  }
  return (
    <GestureDetector gesture={goBackGesture ? panGesture : EmptyGestureHandler}>
      {children}
    </GestureDetector>
  );
};

export default TransitionHandler;

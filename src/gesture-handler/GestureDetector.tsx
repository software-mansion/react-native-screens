import React from 'react';
import { Dimensions, Platform, findNodeHandle } from 'react-native';
import { NativeScreensModule } from 'react-native-screens';

import { GestureDetector, Gesture, PanGestureHandlerEventPayload, GestureUpdateEvent } from 'react-native-gesture-handler';
import Animated, { SharedValue, runOnJS, useAnimatedRef, useSharedValue, updateProps } from 'react-native-reanimated';

const ReanimatedAnimations: Record<string, (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => Record<string, unknown>> = {
  default: (event) => {
    'worklet';
    return {
      transform: [
        { translateX: event.translationX },
      ],
    };
  },
  vertical: (event) => {
    'worklet';
    return {
      transform: [
        { translateY: event.translationY },
      ],
    };
  },
  horizontal: (event) => {
    'worklet';
    return {
      transform: [
        { translateX: event.translationX },
      ],
    };
  },
  twoDimensional: (event) => {
    'worklet';
    return {
      transform: [
        { translateX: event.translationX },
        { translateY: event.translationY },
      ],
    };
  },
  fade: (event) => {
    'worklet';
    return {
      opacity: 1 - Math.abs(event.translationX / Dimensions.get('window').width),
    };
  },
}

type ScreenTransitionConfig = {
  stackTag: number;
  belowTopScreenTag: number;
  topScreenTag: number;
  animation: any;
  isSwipeGesture: boolean;
  sharedEvent: SharedValue<GestureUpdateEvent<PanGestureHandlerEventPayload>>
  onFinishAnimation?: () => void;
  canceled: boolean;
};

const reanimated = {
  startScreenTransition: (animationConfig: ScreenTransitionConfig) => {
    'worklet';
    animationConfig.sharedEvent.addListener(animationConfig.stackTag, () => {
      'worklet';
      const style = animationConfig.animation(animationConfig.sharedEvent.value);
      const viewDescriptor = {value: [{tag: animationConfig.topScreenTag, name: 'RCTView'}]};
      updateProps(viewDescriptor, style);
    });
  },
  finishScreenTransition: (animationConfig: ScreenTransitionConfig) => {
    'worklet';
    animationConfig.sharedEvent.removeListener(animationConfig.stackTag);
    if (animationConfig.onFinishAnimation) {
      animationConfig.onFinishAnimation();
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
  const screenTransitionConfig = useSharedValue<ScreenTransitionConfig>({
    stackTag: 0,
    belowTopScreenTag: Platform.OS === 'ios' ? 35 : 29,
    topScreenTag: Platform.OS === 'ios' ? 69 : 63,
    sharedEvent,
    animation: ReanimatedAnimations.default, 
    isSwipeGesture: true,
    canceled: false,
  });
  const activator = 'leftEdge'; // 'rightEdge' | 'leftEdge' | 'topEdge' | 'bottomEdge'

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
    .activeOffsetX(20)
    .onStart(() => {
      // runOnJS(getTags)();
      sharedEvent.value = defaultEvent;
      const stackTag = stackRefWrapper.ref();
      runOnJS(startTransition)(stackTag);
      screenTransitionConfig.value.stackTag = stackTag;
      reanimated.startScreenTransition(screenTransitionConfig.value);
    })
    .onUpdate(e => {
      sharedEvent.value = e;
      if (screenTransitionConfig.value.isSwipeGesture) {
        const stackTag = stackRefWrapper.ref();
        runOnJS(updateTransition)(stackTag, e.translationX / ScreenSize.width);
      }
    })
    .onEnd((e) => {
      const shouldFinishTransition = (e.translationX + e.velocityX * 0.3) > (ScreenSize.width / 2);
      const stackTag = stackRefWrapper.ref();
      screenTransitionConfig.value.onFinishAnimation = () => runOnJS(finishTransition)(stackTag, !shouldFinishTransition);
      screenTransitionConfig.value.canceled = !shouldFinishTransition;
      reanimated.finishScreenTransition(screenTransitionConfig.value);
    });

  if (activator === 'leftEdge') {
    panGesture = panGesture.activeOffsetX(20);
  } else if (activator === 'rightEdge') {
    panGesture = panGesture.activeOffsetX(-20);
  } else if (activator === 'topEdge') {
    panGesture = panGesture.activeOffsetY(20);
  } else if (activator === 'bottomEdge') {
    panGesture = panGesture.activeOffsetY(-20);
  }

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default TransitionHandler;

// const tags = stackRefWrapper.ref.current._children.map((screen: any) => findNodeHandle(screen));
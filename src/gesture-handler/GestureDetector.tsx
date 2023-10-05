import React from 'react';
import { Dimensions, findNodeHandle } from 'react-native';
import { NativeScreensModule } from 'react-native-screens';

import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const TransitionHandler = ({
  children,
  stackRef,
  topScreenRef,
  belowTopScreenRef,
}) => {
  const screenWidth = Dimensions.get('window').width;

  const panGesture = Gesture.Pan()
    .activeOffsetX(20)
    .onStart(() => {
      const stackHandle = findNodeHandle(stackRef.current);
      NativeScreensModule.startTransition(stackHandle);
      // reanimated.startTransition([stackHandle, topScreenHandle, belowTopScreenHandle], {animation: {'timing', config: {duration: 300}}, isSwipeGesture: true});
    })
    .onUpdate(e => {
      const stackHandle = findNodeHandle(stackRef.current);
      NativeScreensModule.updateTransition(
        stackHandle,
        e.translationX / screenWidth
      );
    })
    .onEnd(() => {
      const stackHandle = findNodeHandle(stackRef.current);
      NativeScreensModule.finishTransition(stackHandle, false);
      // const shouldFinishTransition = (e.translationX + e.velocityX * 0.3) > (screenWidth / 2);
      // reanimated.finishTransition([stackHandle, topScreenHandle, belowTopScreenHandle], {isSwipeGesture: true, canceled: !shouldFinishTransition, onFinishAnimation: () => NativeScreensModule.finishTransition(stackHandle, !shouldFinishTransition)});
    });

  return <GestureDetector gesture={panGesture}>{children}</GestureDetector>;
};

export default TransitionHandler;

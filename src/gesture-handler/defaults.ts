import {
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';

import { ScreenTransition } from 'react-native-reanimated';

const _ScreenTransition = ScreenTransition;
if (!ScreenTransition) {
  throw new Error(
    "[RNScreens] Couldn't initialize `ScreenTransition`. Are you trying to use `goBackGesture` prop and your navigator is wrapped in GestureDetectorProvider? \n\n" +
      "Please make sure that you're using `react-native-reanimated` with version higher than 3.8.1 (or nightly)."
  );
}

export const DefaultEvent: GestureUpdateEvent<PanGestureHandlerEventPayload> = {
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

export const DefaultScreenDimensions = {
  width: 0,
  height: 0,
  x: 0,
  y: 0,
  pageX: 0,
  pageY: 0,
};

export const AnimationForGesture = {
  swipeRight: _ScreenTransition.SwipeRight,
  swipeLeft: _ScreenTransition.SwipeLeft,
  swipeDown: _ScreenTransition.SwipeDown,
  swipeUp: _ScreenTransition.SwipeUp,
  horizontalSwipe: _ScreenTransition.Horizontal,
  verticalSwipe: _ScreenTransition.Vertical,
  twoDimensionalSwipe: _ScreenTransition.TwoDimensional,
};

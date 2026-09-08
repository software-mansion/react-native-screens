import {
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PointerType,
} from 'react-native-gesture-handler';
import { ScreenTransition } from 'react-native-reanimated';

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

  // These two were added in recent versions of gesture handler
  // and they are required to specify. This should be backward
  // compatible unless they strictly parse the objects, which seems
  // not likely. PointerType is present since 2.16.0, StylusData since 2.20.0
  pointerType: PointerType.TOUCH,
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
  swipeRight: ScreenTransition.SwipeRight,
  swipeLeft: ScreenTransition.SwipeLeft,
  swipeDown: ScreenTransition.SwipeDown,
  swipeUp: ScreenTransition.SwipeUp,
  horizontalSwipe: ScreenTransition.Horizontal,
  verticalSwipe: ScreenTransition.Vertical,
  twoDimensionalSwipe: ScreenTransition.TwoDimensional,
};

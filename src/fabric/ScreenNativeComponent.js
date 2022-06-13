/**
 * @flow strict-local
 * @format
 */
/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native/Libraries/Components/View/ViewPropTypes';
import type { HostComponent } from 'react-native/Libraries/Renderer/shims/ReactNativeTypes';
import type { ColorValue } from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {
  BubblingEventHandler,
  WithDefault,
  Int32,
  Double,
  Float,
} from 'react-native/Libraries/Types/CodegenTypes';

type ScreenEvent = $ReadOnly<{||}>;

type ScreenDismissedEvent = $ReadOnly<{|
  dismissCount: Int32,
|}>;

type GestureResponseDistanceType = $ReadOnly<{|
  start: Float,
  end: Float,
  top: Float,
  bottom: Float,
|}>;

type StackPresentation =
  | 'push'
  | 'modal'
  | 'transparentModal'
  | 'fullScreenModal'
  | 'formSheet'
  | 'containedModal'
  | 'containedTransparentModal';

type StackAnimation =
  | 'default'
  | 'flip'
  | 'simple_push'
  | 'none'
  | 'fade'
  | 'slide_from_right'
  | 'slide_from_left'
  | 'slide_from_bottom'
  | 'fade_from_bottom';

type SwipeDirection = 'vertical' | 'horizontal';

type ReplaceAnimation = 'pop' | 'push';

type SharedElementTransition = $ReadOnly<{|
  from: string,
  to: string,
  delay?: WithDefault<Double, 0>,
  duration?: WithDefault<Double, 0>,
  damping?: WithDefault<Float, 1>,
  initialVelocity?: WithDefault<Float, 0>,
  // Codegen doesn't generate code for thoses enums (easing, resizeMode, align)
  // it seems coming from the fact that it's wrapped in a `$ReadOnlyArray`
  easing?: WithDefault<string, 'linear'>,
  resizeMode?: WithDefault<string, 'resize'>,
  align?: WithDefault<string, 'left-top'>,
  showFromElementDuringAnimation?: WithDefault<boolean, false>,
  showToElementDuringAnimation?: WithDefault<boolean, false>,
|}>;

export type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onAppear?: ?BubblingEventHandler<ScreenEvent>,
  onDisappear?: ?BubblingEventHandler<ScreenEvent>,
  onDismissed?: ?BubblingEventHandler<ScreenDismissedEvent>,
  onWillAppear?: ?BubblingEventHandler<ScreenEvent>,
  onWillDisappear?: ?BubblingEventHandler<ScreenEvent>,
  customAnimationOnSwipe?: boolean,
  fullScreenSwipeEnabled?: boolean,
  homeIndicatorHidden?: boolean,
  preventNativeDismiss?: boolean,
  gestureEnabled?: WithDefault<boolean, true>,
  sharedElementTransitions?: $ReadOnlyArray<SharedElementTransition>,
  statusBarColor?: ColorValue,
  statusBarHidden?: boolean,
  screenOrientation?: string,
  statusBarAnimation?: string,
  statusBarStyle?: string,
  statusBarTranslucent?: boolean,
  gestureResponseDistance?: GestureResponseDistanceType,
  stackPresentation?: WithDefault<StackPresentation, 'push'>,
  stackAnimation?: WithDefault<StackAnimation, 'default'>,
  transitionDuration?: WithDefault<Int32, 350>,
  replaceAnimation?: WithDefault<ReplaceAnimation, 'pop'>,
  swipeDirection?: WithDefault<SwipeDirection, 'horizontal'>,
  hideKeyboardOnSwipe?: boolean,
  activityState?: WithDefault<Int32, -1>,
  // TODO: implement these props on iOS
  navigationBarColor?: ColorValue,
  navigationBarHidden?: boolean,
  nativeBackButtonDismissalEnabled?: boolean,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>('RNSScreen', {
  interfaceOnly: true,
}): ComponentType);

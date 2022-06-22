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
} from 'react-native/Libraries/Types/CodegenTypes';

type ScreenEvent = $ReadOnly<{||}>;

type ScreenDismissedEvent = $ReadOnly<{|
  dismissCount: Int32,
|}>;

type TransitionProgressEvent = $ReadOnly<{|
  progress: Double,
  closing: Int32,
  goingForward: Int32,
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

export type NativeProps = $ReadOnly<{|
  ...ViewProps,
  onAppear?: ?BubblingEventHandler<ScreenEvent>,
  onDisappear?: ?BubblingEventHandler<ScreenEvent>,
  onDismissed?: ?BubblingEventHandler<ScreenDismissedEvent>,
  onNativeDismissCancelled?: ?BubblingEventHandler<ScreenDismissedEvent>,
  onWillAppear?: ?BubblingEventHandler<ScreenEvent>,
  onWillDisappear?: ?BubblingEventHandler<ScreenEvent>,
  onTransitionProgress?: ?BubblingEventHandler<TransitionProgressEvent>,
  customAnimationOnSwipe?: boolean,
  fullScreenSwipeEnabled?: boolean,
  homeIndicatorHidden?: boolean,
  preventNativeDismiss?: boolean,
  gestureEnabled?: WithDefault<boolean, true>,
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
  activityState?: WithDefault<Float, -1.0>,
  // TODO: implement these props on iOS
  navigationBarColor?: ColorValue,
  navigationBarHidden?: boolean,
  nativeBackButtonDismissalEnabled?: boolean,
|}>;

type ComponentType = HostComponent<NativeProps>;

export default (codegenNativeComponent<NativeProps>('RNSScreen', {
  interfaceOnly: true,
}): ComponentType);

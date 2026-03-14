'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps, ColorValue } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type ScreenEvent = Readonly<{}>;

type ScreenDismissedEvent = Readonly<{
  dismissCount: CT.Int32;
}>;

type TransitionProgressEvent = Readonly<{
  progress: CT.Double;
  closing: CT.Int32;
  goingForward: CT.Int32;
}>;

type HeaderHeightChangeEvent = Readonly<{
  headerHeight: CT.Double;
}>;

type SheetDetentChangedEvent = Readonly<{
  index: CT.Int32;
  isStable: boolean;
}>;

type GestureResponseDistanceType = Readonly<{
  start: CT.Float;
  end: CT.Float;
  top: CT.Float;
  bottom: CT.Float;
}>;

type StackPresentation =
  | 'push'
  | 'modal'
  | 'transparentModal'
  | 'fullScreenModal'
  | 'formSheet'
  | 'pageSheet'
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
  | 'fade_from_bottom'
  | 'ios_from_right'
  | 'ios_from_left';

type SwipeDirection = 'vertical' | 'horizontal';

type ReplaceAnimation = 'pop' | 'push';

type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

type OptionalBoolean = 'undefined' | 'false' | 'true';

export interface NativeProps extends ViewProps {
  onAppear?: CT.DirectEventHandler<ScreenEvent> | undefined;
  onDisappear?: CT.DirectEventHandler<ScreenEvent> | undefined;
  onDismissed?: CT.DirectEventHandler<ScreenDismissedEvent> | undefined;
  onNativeDismissCancelled?:
    | CT.DirectEventHandler<ScreenDismissedEvent>
    | undefined;
  onWillAppear?: CT.DirectEventHandler<ScreenEvent> | undefined;
  onWillDisappear?: CT.DirectEventHandler<ScreenEvent> | undefined;
  onHeaderHeightChange?:
    | CT.DirectEventHandler<HeaderHeightChangeEvent>
    | undefined;
  onTransitionProgress?:
    | CT.DirectEventHandler<TransitionProgressEvent>
    | undefined;
  onGestureCancel?: CT.DirectEventHandler<ScreenEvent> | undefined;
  onHeaderBackButtonClicked?: CT.DirectEventHandler<ScreenEvent> | undefined;
  onSheetDetentChanged?:
    | CT.DirectEventHandler<SheetDetentChangedEvent>
    | undefined;
  screenId?: CT.WithDefault<string, ''>;
  sheetAllowedDetents?: number[] | undefined;
  sheetLargestUndimmedDetent?: CT.WithDefault<CT.Int32, -1>;
  sheetGrabberVisible?: CT.WithDefault<boolean, false>;
  sheetCornerRadius?: CT.WithDefault<CT.Float, -1.0>;
  sheetExpandsWhenScrolledToEdge?: CT.WithDefault<boolean, false>;
  sheetInitialDetent?: CT.WithDefault<CT.Int32, 0>;
  sheetElevation?: CT.WithDefault<CT.Int32, 24>;
  sheetShouldOverflowTopInset?: CT.WithDefault<boolean, false>;
  sheetDefaultResizeAnimationEnabled?: CT.WithDefault<boolean, true>;
  customAnimationOnSwipe?: boolean;
  fullScreenSwipeEnabled?: CT.WithDefault<OptionalBoolean, 'undefined'>;
  fullScreenSwipeShadowEnabled?: CT.WithDefault<boolean, true>;
  homeIndicatorHidden?: boolean;
  preventNativeDismiss?: boolean;
  gestureEnabled?: CT.WithDefault<boolean, true>;
  statusBarColor?: ColorValue;
  statusBarHidden?: boolean;
  screenOrientation?: string;
  statusBarAnimation?: string;
  statusBarStyle?: string;
  statusBarTranslucent?: boolean;
  gestureResponseDistance?: GestureResponseDistanceType;
  stackPresentation?: CT.WithDefault<StackPresentation, 'push'>;
  stackAnimation?: CT.WithDefault<StackAnimation, 'default'>;
  transitionDuration?: CT.WithDefault<CT.Int32, 500>;
  replaceAnimation?: CT.WithDefault<ReplaceAnimation, 'pop'>;
  swipeDirection?: CT.WithDefault<SwipeDirection, 'horizontal'>;
  hideKeyboardOnSwipe?: boolean;
  activityState?: CT.WithDefault<CT.Float, -1.0>;
  navigationBarColor?: ColorValue;
  navigationBarTranslucent?: boolean;
  navigationBarHidden?: boolean;
  nativeBackButtonDismissalEnabled?: boolean;
  bottomScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  leftScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  rightScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  topScrollEdgeEffect?: CT.WithDefault<ScrollEdgeEffect, 'automatic'>;
  synchronousShadowStateUpdatesEnabled?: CT.WithDefault<boolean, false>;
  androidResetScreenShadowStateOnOrientationChangeEnabled?: CT.WithDefault<
    boolean,
    true
  >;
  ios26AllowInteractionsDuringTransition?: CT.WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>('RNSScreen', {
  interfaceOnly: true,
});

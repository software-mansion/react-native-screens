/// <reference types="react-native/types/modules/codegen" />
import type { ViewProps, ColorValue } from 'react-native';
import type { BubblingEventHandler, WithDefault, Int32, Float, Double } from 'react-native/Libraries/Types/CodegenTypes';
declare type ScreenEvent = Readonly<{}>;
declare type ScreenDismissedEvent = Readonly<{
    dismissCount: Int32;
}>;
declare type TransitionProgressEvent = Readonly<{
    progress: Double;
    closing: Int32;
    goingForward: Int32;
}>;
declare type GestureResponseDistanceType = Readonly<{
    start: Float;
    end: Float;
    top: Float;
    bottom: Float;
}>;
declare type StackPresentation = 'push' | 'modal' | 'transparentModal' | 'fullScreenModal' | 'formSheet' | 'containedModal' | 'containedTransparentModal';
declare type StackAnimation = 'default' | 'flip' | 'simple_push' | 'none' | 'fade' | 'slide_from_right' | 'slide_from_left' | 'slide_from_bottom' | 'fade_from_bottom';
declare type SwipeDirection = 'vertical' | 'horizontal';
declare type ReplaceAnimation = 'pop' | 'push';
declare type SheetDetentTypes = 'large' | 'medium' | 'all';
export interface NativeProps extends ViewProps {
    onAppear?: BubblingEventHandler<ScreenEvent>;
    onDisappear?: BubblingEventHandler<ScreenEvent>;
    onDismissed?: BubblingEventHandler<ScreenDismissedEvent>;
    onNativeDismissCancelled?: BubblingEventHandler<ScreenDismissedEvent>;
    onWillAppear?: BubblingEventHandler<ScreenEvent>;
    onWillDisappear?: BubblingEventHandler<ScreenEvent>;
    onTransitionProgress?: BubblingEventHandler<TransitionProgressEvent>;
    onGestureCancel?: BubblingEventHandler<ScreenEvent>;
    sheetAllowedDetents?: WithDefault<SheetDetentTypes, 'large'>;
    sheetLargestUndimmedDetent?: WithDefault<SheetDetentTypes, 'all'>;
    sheetGrabberVisible?: WithDefault<boolean, false>;
    sheetCornerRadius?: WithDefault<Float, -1.0>;
    sheetExpandsWhenScrolledToEdge?: WithDefault<boolean, false>;
    customAnimationOnSwipe?: boolean;
    fullScreenSwipeEnabled?: boolean;
    homeIndicatorHidden?: boolean;
    preventNativeDismiss?: boolean;
    gestureEnabled?: WithDefault<boolean, true>;
    statusBarColor?: ColorValue;
    statusBarHidden?: boolean;
    screenOrientation?: string;
    statusBarAnimation?: string;
    statusBarStyle?: string;
    statusBarTranslucent?: boolean;
    gestureResponseDistance?: GestureResponseDistanceType;
    stackPresentation?: WithDefault<StackPresentation, 'push'>;
    stackAnimation?: WithDefault<StackAnimation, 'default'>;
    transitionDuration?: WithDefault<Int32, 350>;
    replaceAnimation?: WithDefault<ReplaceAnimation, 'pop'>;
    swipeDirection?: WithDefault<SwipeDirection, 'horizontal'>;
    hideKeyboardOnSwipe?: boolean;
    activityState?: WithDefault<Float, -1.0>;
    navigationBarColor?: ColorValue;
    navigationBarHidden?: boolean;
    nativeBackButtonDismissalEnabled?: boolean;
    onHeaderBackButtonClicked?: BubblingEventHandler<ScreenEvent>;
}
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;

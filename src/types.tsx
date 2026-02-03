import React from 'react';
import {
  Animated,
  NativeSyntheticEvent,
  ViewProps,
  View,
  TargetedEvent,
  TextInputFocusEventData,
  ColorValue,
  ImageSourcePropType,
} from 'react-native';
import type {
  ScrollEdgeEffect,
  UserInterfaceStyle,
} from './components/shared/types';

export type SearchBarCommands = {
  focus: () => void;
  blur: () => void;
  clearText: () => void;
  toggleCancelButton: (show: boolean) => void;
  setText: (text: string) => void;
  cancelSearch: () => void;
};

export type BackButtonDisplayMode = 'default' | 'generic' | 'minimal';
export type StackPresentationTypes =
  | 'push'
  | 'modal'
  | 'transparentModal'
  | 'containedModal'
  | 'containedTransparentModal'
  | 'fullScreenModal'
  | 'formSheet'
  | 'pageSheet';
export type StackAnimationTypes =
  | 'default'
  | 'fade'
  | 'fade_from_bottom'
  | 'flip'
  | 'none'
  | 'simple_push'
  | 'slide_from_bottom'
  | 'slide_from_right'
  | 'slide_from_left'
  | 'ios_from_right'
  | 'ios_from_left';
export type BlurEffectTypes =
  | 'none'
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';
export type ScreenReplaceTypes = 'push' | 'pop';
export type SwipeDirectionTypes = 'vertical' | 'horizontal';
export type ScreenOrientationTypes =
  | 'default'
  | 'all'
  | 'portrait'
  | 'portrait_up'
  | 'portrait_down'
  | 'landscape'
  | 'landscape_left'
  | 'landscape_right';
export type HeaderSubviewTypes =
  | 'back'
  | 'right'
  | 'left'
  | 'center'
  | 'searchBar';

export type HeaderHeightChangeEventType = {
  headerHeight: number;
};

export type TransitionProgressEventType = {
  progress: number;
  closing: number;
  goingForward: number;
};

export type GestureResponseDistanceType = {
  start?: number;
  end?: number;
  top?: number;
  bottom?: number;
};

export type SearchBarPlacement =
  | 'automatic'
  | 'inline' // deprecated starting from iOS 26
  | 'stacked'
  | 'integrated'
  | 'integratedButton'
  | 'integratedCentered';

export type PlatformIconShared = {
  type: 'imageSource';
  imageSource: ImageSourcePropType;
};

export type PlatformIconIOSSfSymbol = {
  type: 'sfSymbol';
  name: string;
};

export type PlatformIconIOSXcasset = {
  type: 'xcasset';
  name: string;
};

export type PlatformIconIOS =
  | PlatformIconIOSSfSymbol
  | PlatformIconIOSXcasset
  | {
      type: 'templateSource';
      templateSource: ImageSourcePropType;
    }
  | PlatformIconShared;

export type PlatformIconAndroid =
  | {
      type: 'drawableResource';
      name: string;
    }
  | PlatformIconShared;

export interface PlatformIcon {
  ios?: PlatformIconIOS;
  android?: PlatformIconAndroid;
  shared?: PlatformIconShared;
}

export interface ScreenProps extends ViewProps {
  active?: 0 | 1 | Animated.AnimatedInterpolation<number>;
  activityState?: 0 | 1 | 2 | Animated.AnimatedInterpolation<number>;
  /**
   * Boolean indicating that the screen should be frozen with `react-freeze`.
   */
  shouldFreeze?: boolean;
  children?: React.ReactNode;
  /**
   * Boolean indicating that swipe dismissal should trigger animation provided by `stackAnimation`. Defaults to `false`.
   *
   * @platform ios
   */
  customAnimationOnSwipe?: boolean;
  /**
   * All children screens should have the same value of their "enabled" prop as their container.
   */
  enabled?: boolean;
  /**
   * Internal boolean used to not attach events used only by native-stack. It prevents non native-stack navigators from sending transition progress from their Screen components.
   */
  isNativeStack?: boolean;
  /**
   * Internal boolean used to detect if current header has large title on iOS.
   */
  hasLargeHeader?: boolean;
  /**
   * Whether inactive screens should be suspended from re-rendering. Defaults to `false`.
   * When `enableFreeze()` is run at the top of the application defaults to `true`.
   */
  freezeOnBlur?: boolean;
  /**
   * Boolean indicating whether the swipe gesture should work on whole screen. The behavior depends on iOS version.
   *
   * For iOS prior to 26, swiping with this option results in the same transition animation as `simple_push` by default.
   * It can be changed to other custom animations with `customAnimationOnSwipe` prop, but default iOS swipe animation
   * is not achievable due to usage of custom recognizer.
   *
   * For iOS 26 and up, native `interactiveContentPopGestureRecognizer` is used, and this prop controls whether it should
   * be enabled or not.
   *
   * When not set, it defaults to `false` on iOS < 26 and `true` for iOS >= 26.
   *
   * @platform ios
   */
  fullScreenSwipeEnabled?: boolean;
  /**
   * Whether the full screen dismiss gesture has shadow under view during transition.
   * When enabled, a custom shadow view is added during the transition which tries to mimic the
   * default iOS shadow. Defaults to `true`.
   *
   * This does not affect the behavior of transitions that don't use gestures, enabled by `fullScreenGestureEnabled` prop.
   *
   * @deprecated since iOS 26, full screen swipe is handled by native recognizer, and this prop is ignored. We still fallback
   * to the legacy implementation when handling custom animations, but we assume `true` for shadows.
   *
   * @platform ios
   */
  fullScreenSwipeShadowEnabled?: boolean;
  /**
   * Whether you can use gestures to dismiss this screen. Defaults to `true`.
   *
   * @platform ios
   */
  gestureEnabled?: boolean;
  /**
   * Use it to restrict the distance from the edges of screen in which the gesture should be recognized. To be used alongside `fullScreenSwipeEnabled`.
   *
   * @platform ios
   */
  gestureResponseDistance?: GestureResponseDistanceType;
  /**
   * Whether the home indicator should be hidden on this screen. Defaults to `false`.
   *
   * @platform ios
   */
  homeIndicatorHidden?: boolean;
  /**
   * Whether the keyboard should hide when swiping to the previous screen. Defaults to `false`.
   *
   * @platform ios
   */
  hideKeyboardOnSwipe?: boolean;
  /**
   * Boolean indicating whether, when the Android default back button is clicked, the `pop` action should be performed on the native side or on the JS side to be able to prevent it.
   * Unfortunately the same behavior is not available on iOS since the behavior of native back button cannot be changed there.
   * Defaults to `false`.
   *
   * @platform android
   */
  nativeBackButtonDismissalEnabled?: boolean;
  /**
   * Configures the scroll edge effect for the _content ScrollView_ (the ScrollView that is present in first descendants chain of the Screen).
   * Depending on values set, it will blur the scrolling content below certain UI elements (header items, search bar)
   * for the specified edge of the ScrollView.
   *
   * When set in nested containers, i.e. ScreenStack inside BottomTabs, or the other way around,
   * the ScrollView will use only the innermost one's config.
   *
   * **Note:** Using both `blurEffect` and `scrollEdgeEffects` (>= iOS 26) simultaneously may cause overlapping effects.
   *
   * Edge effects can be configured for each edge separately. The following values are currently supported:
   *
   * - `automatic` - the automatic scroll edge effect style,
   * - `hard` - a scroll edge effect with a hard cutoff and dividing line,
   * - `soft` - a soft-edged scroll edge effect,
   * - `hidden` - no scroll edge effect.
   *
   * The supported values correspond to the `UIScrollEdgeEffect`'s `style` and `isHidden` props
   * in the official UIKit documentation:
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiscrolledgeeffect|UIScrollEdgeEffect}
   *
   * @default `automatic` for each edge
   *
   * @platform ios
   *
   * @supported iOS 26 or higher
   */
  scrollEdgeEffects?: {
    bottom: ScrollEdgeEffect;
    left: ScrollEdgeEffect;
    right: ScrollEdgeEffect;
    top: ScrollEdgeEffect;
  };
  /**
   * @deprecated Setting this prop has no effect. Retained only for backward compatibility.
   *
   * For all apps targeting Android SDK 35 or above this prop has no effect.
   * See: https://developer.android.com/reference/android/view/Window#setNavigationBarColor(int)
   */
  navigationBarColor?: ColorValue;
  /**
   * @deprecated Setting this prop has no effect. Retained only for backward compatibility.
   *
   * For all apps targeting Android SDK 35 or above edge-to-edge is enabled by default.
   * See: https://developer.android.com/about/versions/15/behavior-changes-15#window-insets
   */
  navigationBarTranslucent?: boolean;
  /**
   * Sets the visibility of the navigation bar. Defaults to `false`.
   *
   * @platform android
   */
  navigationBarHidden?: boolean;
  /**
   * A callback that gets called when the current screen appears.
   */
  onAppear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  onComponentRef?: (view: unknown) => void;
  /**
   * A callback that gets called when the current screen disappears.
   */
  onDisappear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down).
   * The callback takes the number of dismissed screens as an argument since iOS 14 native header back button can pop more than 1 screen at a time.
   */
  onDismissed?: (e: NativeSyntheticEvent<{ dismissCount: number }>) => void;
  /**
   * A callback that gets called when the header height has changed.
   */
  onHeaderHeightChange?: (
    e: NativeSyntheticEvent<HeaderHeightChangeEventType>,
  ) => void;
  /**
   * A callback that gets called after swipe back is canceled.
   */
  onGestureCancel?: (e: NativeSyntheticEvent<null>) => void;
  /**
   * An internal callback that gets called when the native header back button is clicked on Android and `enableNativeBackButtonDismissal` is set to `false`. It dismises the screen using `navigation.pop()`.
   *
   * @platform android
   */
  onHeaderBackButtonClicked?: () => void;
  /**
   * An internal callback called when screen is dismissed by gesture or by native header back button and `preventNativeDismiss` is set to `true`.
   *
   * @platform ios
   */
  onNativeDismissCancelled?: (
    e: NativeSyntheticEvent<{ dismissCount: number }>,
  ) => void;
  /**
   * A callback that gets called when the current screen is in `formSheet` presentation and its detent has changed.
   */
  onSheetDetentChanged?: (
    e: NativeSyntheticEvent<{ index: number; isStable: boolean }>,
  ) => void;
  /**
   * An internal callback called every frame during the transition of screens of `native-stack`, used to feed transition context.
   */
  onTransitionProgress?: (
    e: NativeSyntheticEvent<TransitionProgressEventType>,
  ) => void;
  /**
   * A callback that gets called when the current screen will appear. This is called as soon as the transition begins.
   */
  onWillAppear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when the current screen will disappear. This is called as soon as the transition begins.
   */
  onWillDisappear?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * Boolean indicating whether to prevent current screen from being dismissed.
   * Defaults to `false`.
   *
   * @platform ios
   */
  preventNativeDismiss?: boolean;
  ref?: React.Ref<View>;
  /**
   * How should the screen replacing another screen animate. Defaults to `pop`.
   * The following values are currently supported:
   * - "push" – the new screen will perform push animation.
   * - "pop" – the new screen will perform pop animation.
   */
  replaceAnimation?: ScreenReplaceTypes;
  /**
   * A way to identify the screen in native code. This value will be passed down to native side,
   * where it can be later consulted. Meant for native integration with the library.
   * This should be unique value across all screen instances, however it is not asserted on native side.
   *
   * Empty string translates to `undefined`.
   *
   * @platform ios
   */
  screenId?: string | undefined;
  /**
   * In which orientation should the screen appear.
   * The following values are currently supported:
   * - "default" - resolves to "all" without "portrait_down" on iPhone devices, "all" on iPad devices. On Android, this lets the system decide the best orientation.
   * - "all" – all orientations are permitted
   * - "portrait" – portrait orientations are permitted
   * - "portrait_up" – right-side portrait orientation is permitted
   * - "portrait_down" – upside-down portrait orientation is permitted
   * - "landscape" – landscape orientations are permitted
   * - "landscape_left" – landscape-left orientation is permitted
   * - "landscape_right" – landscape-right orientation is permitted
   */
  screenOrientation?: ScreenOrientationTypes;
  /**
   * Describes heights where a sheet can rest.
   * Works only when `presentation` is set to `formSheet`.
   *
   * Heights should be described as fraction (a number from `[0, 1]` interval) of screen height / maximum detent height.
   * You can pass an array of ascending values each defining allowed sheet detent. iOS accepts any number of detents,
   * while **Android is limited to three**.
   *
   * There is also possibility to specify `fitToContents` literal, which intents to set the sheet height
   * to the height of its contents. On iOS `fitToContents` currently also includes small padding accounting for bottom inset.
   *
   * Please note that the array **must** be sorted in ascending order. This invariant is verified only in developement mode,
   * where violation results in error.
   *
   * **Android is limited to up 3 values in the array** -- any surplus values, beside first three are ignored.
   *
   * There are also legacy & **deprecated** options available:
   *
   * * 'medium' - corresponds to `[0.5]` detent value, around half of the screen height,
   * * 'large' - corresponds to `[1.0]` detent value, maximum height,
   * * 'all' - corresponds to `[0.5, 1.0]` value, the name is deceiving due to compatibility reasons.
   *
   * These are provided solely for **temporary** backward compatibility and are destined for removal in future versions.
   *
   * Defaults to `[1.0]`.
   */
  sheetAllowedDetents?: number[] | 'fitToContents' | 'medium' | 'large' | 'all';
  /**
   * Integer value describing elevation of the sheet, impacting shadow on the top edge of the sheet.
   *
   * Not dynamic - changing it after the component is rendered won't have an effect.
   *
   * Defaults to `24`.
   *
   * @platform Android
   */
  sheetElevation?: number;
  /**
   * Whether the sheet should expand to larger detent when scrolling.
   * Works only when `stackPresentation` is set to `formSheet`.
   * Defaults to `true`.
   *
   * @platform ios
   */
  sheetExpandsWhenScrolledToEdge?: boolean;
  /**
   * The corner radius that the sheet will try to render with.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * If set to non-negative value it will try to render sheet with provided radius, else it will apply system default.
   *
   * If left unset system default is used.
   *
   * @platform ios
   */
  sheetCornerRadius?: number;
  /**
   * Boolean indicating whether the sheet shows a grabber at the top.
   * Works only when `stackPresentation` is set to `formSheet`.
   * Defaults to `false`.
   *
   * @platform ios
   */
  sheetGrabberVisible?: boolean;
  /**
   * The largest sheet detent for which a view underneath won't be dimmed.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * This prop can be set to an number, which indicates index of detent in `sheetAllowedDetents` array for which
   * there won't be a dimming view beneath the sheet.
   *
   * If the specified index is out of bounds of `sheetAllowedDetents` array, in dev environment mode error will be thrown,
   * in production the value will be reset to default value.
   *
   * Additionaly there are following options available:
   *
   * * `none` - there will be dimming view for all detents levels,
   * * `last` - there won't be a dimming view for any detent level.
   *
   * There also legacy & **deprecated** prop values available: `medium`, `large` (don't confuse with `largest`), `all`, which work in tandem with
   * corresponding legacy prop values for `sheetAllowedDetents` prop.
   *
   * These are provided solely for **temporary** backward compatibility and are destined for removal in future versions.
   *
   * @remark
   * On iOS, the native implementation might resize the the sheet w/o explicitly changing the detent level, e.g. in case of keyboard appearance.
   * In case after such resize the sheet exceeds height for which in regular scenario a dimming view would be applied - it will be applied,
   * even if the detent has not effectively been changed.
   *
   * Defaults to `none`, indicating that the dimming view should be always present.
   */
  sheetLargestUndimmedDetentIndex?:
    | number
    | 'none'
    | 'last'
    | 'medium' // deprecated
    | 'large' // deprecated
    | 'all'; // deprecated
  /**
   * Index of the detent the sheet should expand to after being opened.
   * Works only when `stackPresentation` is set to `formSheet`.
   *
   * If the specified index is out of bounds of `sheetAllowedDetents` array, in dev environment more error will be thrown,
   * in production the value will be reset to default value.
   *
   * Additionaly there is `last` value available, when set the sheet will expand initially to last (largest) detent.
   *
   * Defaults to `0` - which represents first detent in the detents array.
   */
  sheetInitialDetentIndex?: number | 'last';
  /**
   * Whether the sheet content should be rendered behind the Status Bar or display cutouts.
   *
   * When set to `true`, the sheet will extend to the physical edges of the stack,
   * allowing content to be visible behind the status bar or display cutouts.
   * Detent ratios in sheetAllowedDetents will be measured relative to the full stack height.
   *
   * When set to `false`, the sheet's layout will be constrained by the inset from the top
   * and the detent ratios will then be measured relative to the adjusted height (excluding the top inset).
   * This means that sheetAllowedDetents will result in different sheet heights depending on this prop.
   *
   * Defaults to `false`.
   *
   * @platform android
   */
  sheetShouldOverflowTopInset?: boolean;
  /**
   * Whether the default native animation should be used when the sheet's with
   * `fitToContents` content size changes.
   *
   * When set to `true`, the sheet uses internal logic to synchronize size updates and
   * translation animations during entry, exit, or content updates. This ensures a smooth
   * transition for standard, static content mounting/unmounting.
   *
   * When set to `false`, the internal animation and translation logic is ignored. This
   * allows the sheet to adjust its size dynamically based on the current dimensions of
   * the content provided by the developer, allowing implementing custom resizing animations.
   *
   * Defaults to `true`.
   *
   * @platform android
   */
  sheetDefaultResizeAnimationEnabled?: boolean;
  /**
   * How the screen should appear/disappear when pushed or popped at the top of the stack.
   * The following values are currently supported:
   * - "default" – uses a platform default animation
   * - "fade" – fades screen in or out
   * - "fade_from_bottom" – performs a fade from bottom animation
   * - "flip" – flips the screen, requires stackPresentation: "modal" (iOS only)
   * - "simple_push" – performs a default animation, but without native header transition (iOS only)
   * - `slide_from_bottom` – performs a slide from bottom animation
   * - "slide_from_right" - slide in the new screen from right to left (Android only, resolves to default transition on iOS)
   * - "slide_from_left" - slide in the new screen from left to right
   * - "ios_from_right" - iOS like slide in animation. pushes in the new screen from right to left (Android only, resolves to default transition on iOS)
   * - "ios_from_left" - iOS like slide in animation. pushes in the new screen from left to right (Android only, resolves to default transition on iOS)
   * - "none" – the screen appears/dissapears without an animation
   */
  stackAnimation?: StackAnimationTypes;
  /**
   * How should the screen be presented.
   * The following values are currently supported:
   * - "push" – the new screen will be pushed onto a stack which on iOS means that the default animation will be slide from the side, the animation on Android may vary depending on the OS version and theme. Supports nested stack rendering.
   * - "modal" – the new screen will be presented modally. On iOS it'll use `UIModalPresentationStyleAutomatic`. On Android this is equivalent to `push` presentation type. Supports nested stack rendering.
   * - "transparentModal" – the new screen will be presented modally but in addition the second to last screen will remain attached to the stack container such that if the top screen is non opaque the content below can still be seen. If "modal" is used instead the below screen will get unmounted as soon as the transition ends.
   * - "containedModal" – will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to "modal" on Android.
   * - "containedTransparentModal" – will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to "transparentModal" on Android.
   * - "fullScreenModal" – will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to "modal" on Android.
   * - "formSheet" – will use "UIModalPresentationFormSheet" modal style on iOS, on Android this will use Material BottomSheetBehaviour. On Android neested stack rendering is not yet supported.
   * - "pageSheet" – will use "UIModalPresentationPageSheet" modal style on iOS and will fallback to "modal" on Android.
   */
  stackPresentation?: StackPresentationTypes;
  /**
   * Sets the status bar animation (similar to the `StatusBar` component).
   * On Android, setting either `fade` or `slide` will set the transition of status bar color. On iOS, this option applies to appereance animation of the status bar.
   * Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS.
   *
   * Defaults to `fade` on iOS and `none` on Android.
   */
  statusBarAnimation?: 'none' | 'fade' | 'slide';
  /**
   * @deprecated Setting this prop has no effect. Retained only for backward compatibility.
   *
   * For all apps targeting Android SDK 35 or above this prop has no effect.
   * See: https://developer.android.com/reference/android/view/Window#setStatusBarColor(int)
   */
  statusBarColor?: ColorValue;
  /**
   * Whether the status bar should be hidden on this screen. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS. Defaults to `false`.
   */
  statusBarHidden?: boolean;
  /**
   * Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file on iOS.
   * `auto` and `inverted` are supported only on iOS. On Android, they will fallback to `light`.
   * Defaults to `auto` on iOS and `light` on Android.
   */
  statusBarStyle?: 'inverted' | 'auto' | 'light' | 'dark';
  /**
   * @deprecated Setting this prop has no effect. Retained only for backward compatibility.
   *
   * For all apps targeting Android SDK 35 or above edge-to-edge mode on Android is enabled by default and this prop loses relevance.
   * See: https://developer.android.com/about/versions/15/behavior-changes-15#ux.
   */
  statusBarTranslucent?: boolean;
  /**
   * Sets the direction in which you should swipe to dismiss the screen.
   * When using `vertical` option, options `fullScreenSwipeEnabled: true`, `customAnimationOnSwipe: true` and `stackAnimation: 'slide_from_bottom'` are set by default.
   * The following values are supported:
   * - `vertical` – dismiss screen vertically
   * - `horizontal` – dismiss screen horizontally (default)
   *
   * @platform ios
   */
  swipeDirection?: SwipeDirectionTypes;
  /**
   * Changes the duration (in milliseconds) of `slide_from_bottom`, `fade_from_bottom`, `fade` and `simple_push` transitions on iOS. Defaults to `500`.
   * For screens with `default` and `flip` transitions, and, as of now, for screens with `presentation` set to `modal`, `formSheet`, `pageSheet` (regardless of transition), the duration isn't customizable.
   *
   * @platform ios
   */
  transitionDuration?: number;
  /**
   * Footer component that can be used alongside formSheet stack presentation style.
   *
   * This option is provided, because due to implementation details it might be problematic
   * to implement such layout with JS-only code.
   *
   * Please note that this prop is marked as unstable and might be subject of breaking changes,
   * including removal, in particular when we find solution that will make implementing it with JS
   * straightforward.
   *
   * @platform android
   */
  unstable_sheetFooter?: () => React.ReactNode;
}

export interface ScreenContainerProps extends ViewProps {
  children?: React.ReactNode;
  /**
   * A prop that gives users an option to switch between using Screens for the navigator (container). All children screens should have the same value of their "enabled" prop as their container.
   */
  enabled?: boolean;
  /**
   * A prop to be used in navigators always showing only one screen (providing only `0` or `2` `activityState` values) for better implementation of `ScreenContainer` on iOS.
   */
  hasTwoStates?: boolean;
}

export interface GestureDetectorBridge {
  /**
   * Callback to attach into ScreenStack's useEffect() from ScreenGestureDetector that wraps the stack.
   *
   * @param stackRef holds a reference to an instance of ScreenStackNativeComponent
   */
  stackUseEffectCallback: (
    stackRef: React.MutableRefObject<React.Ref<View>>,
  ) => void;
}

export interface ScreenStackProps extends ViewProps, GestureProps {
  children?: React.ReactNode;
  /**
   * A callback that gets called when the current screen finishes its transition.
   */
  onFinishTransitioning?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  ref?: React.MutableRefObject<React.Ref<View>>;
}

export interface ScreenStackHeaderConfigProps extends ViewProps {
  /**
   * Whether to show the back button with custom left side of the header.
   */
  backButtonInCustomView?: boolean;
  /**
   * Controls the color of the navigation header.
   */
  backgroundColor?: ColorValue;
  /**
   * Title to display in the back button.
   * @platform ios.
   */
  backTitle?: string;
  /**
   * Allows for customizing font family to be used for back button title on iOS.
   * @platform ios
   */
  backTitleFontFamily?: string;
  /**
   * Allows for customizing font size to be used for back button title on iOS.
   * @platform ios
   */
  backTitleFontSize?: number;
  /**
   * Whether the back button title should be visible or not. Defaults to `true`.
   *
   * When set to `false` it works as a "kill switch": it enforces `backButtonDisplayMode=minimal` and ignores `backButtonDisplayMode`, `backTitleFontSize`, `backTitleFontFamily`, `disableBackButtonMenu`.
   * For `backTitle` it works only in back button menu.
   *
   * @platform ios
   */
  backTitleVisible?: boolean;
  /**
   * Blur effect to be applied to the header. Works with backgroundColor's alpha < 1.
   *
   * **Note:** Using both `blurEffect` and `scrollEdgeEffects` (>= iOS 26) simultaneously may cause overlapping effects.
   *
   * @platform ios
   */
  blurEffect?: BlurEffectTypes;
  /**
   * Pass HeaderLeft, HeaderRight and HeaderTitle
   */
  children?: React.ReactNode;
  /**
   * Controls the color of items rendered on the header. This includes back icon, back text (iOS only) and title text. If you want the title to have different color use titleColor property.
   */
  color?: ColorValue;
  /**
   * Whether the stack should be in rtl or ltr form.
   */
  direction?: 'rtl' | 'ltr';
  /**
   * Boolean indicating whether to show the menu on longPress of iOS >= 14 back button.
   * @platform ios
   */
  disableBackButtonMenu?: boolean;
  /**
   * How the back button behaves. It is used only when none of: `backTitleFontFamily`, `backTitleFontSize`, `disableBackButtonMenu` and `backTitleVisible=false` is set.
   * The following values are currently supported (they correspond to [UINavigationItemBackButtonDisplayMode](https://developer.apple.com/documentation/uikit/uinavigationitembackbuttondisplaymode?language=objc)):
   *
   * - `default` – show given back button previous controller title, system generic or just icon based on available space
   * - `generic` – show given system generic or just icon based on available space
   * - `minimal` – show just an icon
   *
   * @platform ios
   */
  backButtonDisplayMode?: BackButtonDisplayMode;
  /**
   * Array of UIBarButtomItems to the left side of the header.
   *
   * @platform ios
   */
  headerLeftBarButtonItems?: HeaderBarButtonItem[];
  /**
   * Array of UIBarButtomItems to the right side of the header.
   *
   * @platform ios
   */
  headerRightBarButtonItems?: HeaderBarButtonItem[];
  /**
   * When set to true the header will be hidden while the parent Screen is on the top of the stack. The default value is false.
   */
  hidden?: boolean;
  /**
   * Boolean indicating whether to hide the back button in header.
   */
  hideBackButton?: boolean;
  /**
   * Boolean indicating whether to hide the elevation shadow or the bottom border on the header.
   */
  hideShadow?: boolean;
  /**
   * Boolean to set native property to prefer large title header (like in iOS setting).
   * For large title to collapse on scroll, the content of the screen should be wrapped in a scrollable view such as `ScrollView` or `FlatList`.
   * If the scrollable area doesn't fill the screen, the large title won't collapse on scroll.
   * Only supported on iOS.
   *
   * @platform ios
   */
  largeTitle?: boolean;
  /**
   * Controls the color of the navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
   */
  largeTitleBackgroundColor?: ColorValue;
  /**
   * Customize the color to be used for the large title. By default uses the titleColor property.
   * @platform ios
   */
  largeTitleColor?: ColorValue;
  /**
   * Customize font family to be used for the large title.
   * @platform ios
   */
  largeTitleFontFamily?: string;
  /**
   * Customize the size of the font to be used for the large title.
   * @platform ios
   */
  largeTitleFontSize?: number;
  /**
   * Customize the weight of the font to be used for the large title.
   * @platform ios
   */
  largeTitleFontWeight?: string;
  /**
   * Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
   */
  largeTitleHideShadow?: boolean;
  /**
   * Callback which is executed when screen header is attached
   */
  onAttached?: () => void;
  /**
   * Callback which is executed when screen header is detached
   */
  onDetached?: () => void;
  /**
   * String that can be displayed in the header as a fallback for `headerTitle`.
   */
  title?: string;
  /**
   * Allows for setting text color of the title.
   */
  titleColor?: ColorValue;
  /**
   * Customize font family to be used for the title.
   */
  titleFontFamily?: string;
  /**
   * Customize the size of the font to be used for the title.
   */
  titleFontSize?: number;
  /**
   * Customize the weight of the font to be used for the title.
   */
  titleFontWeight?: string;
  /**
   * @deprecated Setting this prop has no effect. Retained only for backward compatibility.
   *
   * For apps targeting Android SDK 35 or above edge-to-edge mode is enabled by default
   * therefore this prop loses its relevance.
   */
  topInsetEnabled?: boolean;
  /**
   * Boolean indicating whether the navigation bar is translucent.
   */
  translucent?: boolean;
  /**
   * Allows to override system appearance for the navigation bar.
   *
   * Does not support dynamic changes to the prop value for the currently visible screen.
   *
   * Please note that this prop is marked as **experimental** and might be subject to breaking changes or even removal.
   *
   * The following values are currently supported:
   * - `unspecified` - an unspecified interface style,
   * - `light` - the light interface style,
   * - `dark` - the dark interface style.
   *
   * The supported values correspond to the official UIKit documentation:
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiuserinterfacestyle|UIUserInterfaceStyle}
   *
   * @default unspecified
   * @platform ios
   */
  experimental_userInterfaceStyle?: UserInterfaceStyle;
}

export interface SearchBarProps {
  /**
   * Reference to imperatively modify search bar.
   *
   * Currently supported operations are:
   *
   * * `focus` - focuses the search bar
   * * `blur` - removes focus from the search bar
   * * `clearText` - removes any text present in the search bar input field
   * * `setText` - sets the search bar's content to given value
   * * `cancelSearch` - cancel search in search bar.
   * * `toggleCancelButton` - depending on passed boolean value, hides or shows cancel button (iOS only)
   */
  ref?: React.RefObject<SearchBarCommands | null>;

  /**
   * The auto-capitalization behavior.
   *
   * Defaults to `systemDefault`:
   * - on Android, it is the same as `none`,
   * - on iOS, it is the same as `sentences`.
   */
  autoCapitalize?:
    | 'systemDefault'
    | 'none'
    | 'words'
    | 'sentences'
    | 'characters';
  /**
   * Automatically focuses search bar on mount
   *
   * @platform android
   */
  autoFocus?: boolean;
  /**
   * The search field background color
   */
  barTintColor?: ColorValue;
  /**
   * The color for the cursor caret and cancel button text.
   *
   * @platform ios
   */
  tintColor?: ColorValue;
  /**
   * The text to be used instead of default `Cancel` button text
   *
   * @deprecated Starting from iOS 26, cancel button does not have any text,
   * therefore this prop has no longer any effect.
   *
   * @platform ios
   */
  cancelButtonText?: string;
  /**
   * Specifies whether the back button should close search bar's text input or not.
   *
   * @platform android
   */
  disableBackButtonOverride?: boolean;
  /**
   * Indicates whether to hide the navigation bar.
   *
   * If value is `undefined`, uses native behavior:
   * - on iOS versions prior to 26, value is `true`,
   * - starting from iOS 26, value is determined by context.
   *
   * Restoring native behavior after setting the value to `true` or `false` is unsupported.
   *
   * @platform ios
   */
  hideNavigationBar?: boolean;
  /**
   * Indicates whether to hide the search bar when scrolling
   *
   * @platform ios
   */
  hideWhenScrolling?: boolean;
  /**
   * Sets type of the input. Defaults to `text`.
   *
   * @platform android
   */
  inputType?: 'text' | 'phone' | 'number' | 'email';
  /**
   * Indicates whether to obscure the underlying content.
   *
   * If value is `undefined`, uses native behavior:
   * - on iOS, value is `false`,
   * - on tvOS, value is `true`.
   *
   * Restoring native behavior after setting the value to `true` or `false` is unsupported.
   *
   * @platform ios
   */
  obscureBackground?: boolean;
  /**
   * A callback that gets called when search bar has lost focus
   */
  onBlur?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when the cancel button is pressed
   *
   * @platform ios
   */
  onCancelButtonPress?: (e: NativeSyntheticEvent<TargetedEvent>) => void;

  /**
   * A callback that gets called when the text changes. It receives the current text value of the search bar.
   */
  onChangeText?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;

  /**
   * A callback that gets called when search bar is closed
   *
   * @platform android
   */
  onClose?: () => void;
  /**
   * A callback that gets called when search bar has received focus
   */
  onFocus?: (e: NativeSyntheticEvent<TargetedEvent>) => void;
  /**
   * A callback that gets called when search bar is opened
   *
   * @platform android
   */
  onOpen?: () => void;
  /**
   * A callback that gets called when the search button is pressed. It receives the current text value of the search bar.
   */
  onSearchButtonPress?: (
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => void;
  /**
   * Text displayed when search field is empty
   */
  placeholder?: string;
  /**
   * Position of the search bar
   *
   * Supported values:
   *
   * * `automatic` - the search bar is placed according to current layout
   * * `stacked` - the search bar is placed below the other content in navigation bar
   * * `integrated` - (>= iOS 26) the search bar is placed on the trailing edge of navigation bar. On iPhone,
   *   it may be integrated into the toolbar
   * * `integratedButton` - (>= iOS 26) the search bar has the same placement as `integrated`, except that
   *   the inactive search bar is always shown as a button even when space permits a search field
   * * `integratedCentered` - (>= iOS 26) the search bar has the same placement as `integrated`, except that
   *   in the regular width on iPad, the search bar is centered in the navigation bar. Only
   *   respected in special cases, described in UIKit documentation
   *
   * There is also legacy & **deprecated** prop value available:
   *
   *  * `inline` - the search bar is placed on the trailing edge of navigation bar
   *
   * Starting from iOS 26, `inline` is the same as `integrated`. It is provided for backward
   * compatibility and is destined for removal in future versions.
   *
   * For iOS versions prior to 26, `integrated`, `integratedButton`, `integratedCentered` are
   * the same as `inline`.
   *
   * Defaults to `automatic`.
   *
   * Complete list of possible search bar placements is available in the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uinavigationitem/searchbarplacement-swift.enum|UINavigationItem.SearchBarPlacement}
   *
   * @platform iOS (>= 16.0)
   */
  placement?: SearchBarPlacement;
  /**
   * Indicates whether the system can place the search bar among other toolbar items on iPhone.
   *
   * Set this prop to `false` to prevent the search bar from appearing in the toolbar when
   * `placement` is `automatic`, `integrated`, `integratedButton` or `integratedCentered`.
   *
   * Defaults to `true`.
   * When `placement` is set to `stacked`, this property's value will be overridden with `false`
   * to circumvent a UIKit native bug that prevents the search bar from appearing on the root screen.
   *
   * @platform iOS (>= 26.0)
   */
  allowToolbarIntegration?: boolean;
  /**
   * The search field text color
   */
  textColor?: ColorValue;
  /**
   * The search hint text color
   *
   * @plaform android
   */
  hintTextColor?: ColorValue;
  /**
   * The search and close icon color shown in the header
   *
   * @plaform android
   */
  headerIconColor?: ColorValue;
  /**
   * Show the search hint icon when search bar is focused
   *
   * @plaform android
   * @default true
   */
  shouldShowHintSearchIcon?: boolean;
}

export interface ScreenStackHeaderSubviewProps {
  /**
   * A boolean value indicating whether the background this item may share with other items in the bar should be hidden.
   * Only applicable to type="right" and type="left" subviews.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/hidessharedbackground
   */
  hidesSharedBackground?: boolean;
}

interface SharedHeaderBarButtonItem {
  /**
   * Position of the item in the navigation items array.
   */
  index?: number;
  /**
   * Title of the item.
   */
  title?: string;
  /**
   * Style for the item label.
   */
  titleStyle?: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string;
    color?: ColorValue;
  };
  /**
   * Icon for the item
   */
  icon?: PlatformIconIOS;
  /**
   * The variant of the item.
   * "Prominent" only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/style-swift.property
   */
  variant?: 'plain' | 'done' | 'prominent';
  /**
   * The tint color to apply to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/tintcolor
   */
  tintColor?: ColorValue;
  /**
   * A Boolean value that indicates whether the item is in a disabled state.
   */
  disabled?: boolean;
  /**
   * The width of the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/width
   */
  width?: number;
  /**
   * A boolean value indicating whether the background this item may share with other items in the bar should be hidden.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/hidessharedbackground
   */
  hidesSharedBackground?: boolean;
  /**
   * A boolean value indicating whether this item can share a background with other items in a navigation bar or a toolbar.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/sharesbackground
   */
  sharesBackground?: boolean;
  /**
   * An identifier used to match items across transitions in a navigation bar or toolbar.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/identifier
   */
  identifier?: string;
  /**
   * A badge to be rendered on a item.
   * Only available from iOS 26.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitembadge
   */
  badge?: {
    /**
     * The text to display in the badge.
     */
    value: string;
    /**
     * Style of the badge.
     */
    style?: {
      color?: ColorValue;
      backgroundColor?: ColorValue;
      fontFamily?: string;
      fontSize?: number;
      fontWeight?: string;
    };
  };
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface HeaderBarButtonItemWithAction
  extends SharedHeaderBarButtonItem {
  type: 'button';
  onPress: () => void;
  /**
   * A Boolean value that indicates whether the item is in a selected state.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/isselected
   */
  selected?: boolean;
}

export interface HeaderBarButtonItemMenuAction {
  type: 'action';
  title?: string;
  subtitle?: string;
  onPress: () => void;
  icon?: PlatformIconIOSSfSymbol | PlatformIconIOSXcasset;
  /**
   * State of the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/state
   */
  state?: 'on' | 'off' | 'mixed';
  /**
   * Indicates whether to apply disabled style to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/disabled
   */
  disabled?: boolean;
  /**
   * Indicates whether to apply destructive style to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/destructive
   */
  destructive?: boolean;
  /**
   * Indicates whether to apply hidden style to the item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/hidden
   */
  hidden?: boolean;
  /**
   * Indicates whether to keep the menu presented after firing the element’s action.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uimenuelement/attributes/keepsmenupresented
   */
  keepsMenuPresented?: boolean;
  /**
   * Discoverability label of the menu item.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uiaction/discoverabilitytitle
   */
  discoverabilityLabel?: string;
}

export interface HeaderBarButtonItemSubmenu {
  type: 'submenu';
  title?: string;
  icon?: PlatformIconIOSSfSymbol | PlatformIconIOSXcasset;
  items: HeaderBarButtonItemWithMenu['menu']['items'];
  displayInline?: boolean;
  destructive?: boolean;
  singleSelection?: boolean;
  displayAsPalette?: boolean;
}

export interface HeaderBarButtonItemWithMenu extends SharedHeaderBarButtonItem {
  type: 'menu';
  menu: {
    title?: string;
    items: (HeaderBarButtonItemMenuAction | HeaderBarButtonItemSubmenu)[];
    singleSelection?: boolean;
    displayAsPalette?: boolean;
  };
  /**
   * A Boolean value that indicates whether the button title should indicate selection or not.
   * Only available from iOS 15.0 and later.
   *
   * Read more: https://developer.apple.com/documentation/uikit/uibarbuttonitem/changesselectionasprimaryaction
   */
  changesSelectionAsPrimaryAction?: boolean;
}

export interface HeaderBarButtonItemSpacing {
  type: 'spacing';
  spacing: number;
}

export type HeaderBarButtonItem =
  | HeaderBarButtonItemWithAction
  | HeaderBarButtonItemWithMenu
  | HeaderBarButtonItemSpacing;

/**
 * Custom Screen Transition
 */

/**
 * copy from GestureHandler to avoid strong dependency
 */
export type PanGestureHandlerEventPayload = {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  translationX: number;
  translationY: number;
  velocityX: number;
  velocityY: number;
};

/**
 * copy from Reanimated to avoid strong dependency
 */
export type GoBackGesture =
  | 'swipeRight'
  | 'swipeLeft'
  | 'swipeUp'
  | 'swipeDown'
  | 'verticalSwipe'
  | 'horizontalSwipe'
  | 'twoDimensionalSwipe';

export interface MeasuredDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}

export type AnimatedScreenTransition = {
  topScreenStyle: (
    event: PanGestureHandlerEventPayload,
    screenSize: MeasuredDimensions,
  ) => Record<string, unknown>;
  belowTopScreenStyle: (
    event: PanGestureHandlerEventPayload,
    screenSize: MeasuredDimensions,
  ) => Record<string, unknown>;
};

export type ScreensRefsHolder = Record<string, React.RefObject<View>>;

export interface GestureProps {
  screensRefs?: React.MutableRefObject<ScreensRefsHolder>;
  currentScreenId?: string;
  goBackGesture?: GoBackGesture;
  transitionAnimation?: AnimatedScreenTransition;
  screenEdgeGesture?: boolean;
}

export interface GestureProviderProps extends GestureProps {
  children?: React.ReactNode;
  gestureDetectorBridge: React.MutableRefObject<GestureDetectorBridge>;
}

export type * from './components/tabs';
export type * from './components/shared/types';

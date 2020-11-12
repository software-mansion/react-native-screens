// Project: https://github.com/kmagiera/react-native-screens
// TypeScript Version: 2.8

declare module 'react-native-screens' {
  import { ComponentClass } from 'react';
  import {
    Animated,
    ImageProps,
    NativeSyntheticEvent,
    NativeTouchEvent,
    ViewProps,
  } from 'react-native';

  export function enableScreens(shouldEnableScreens?: boolean): void;
  export function screensEnabled(): boolean;

  export type StackPresentationTypes =
    | 'push'
    | 'modal'
    | 'transparentModal'
    | 'containedModal'
    | 'containedTransparentModal'
    | 'fullScreenModal'
    | 'formSheet';
  export type StackAnimationTypes = 'default' | 'fade' | 'flip' | 'none';
  export type BlurEffectTypes =
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

  export interface ScreenProps extends ViewProps {
    active?: 0 | 1 | Animated.AnimatedInterpolation;
    activityState?: 0 | 1 | 2 | Animated.AnimatedInterpolation;
    children?: React.ReactNode;
    /**
     * @description All children screens should have the same value of their "enabled" prop as their container.
     */
    enabled?: boolean;
    /**
     * @description When set to false the back swipe gesture will be disabled when the parent Screen is on top of the stack. The default value is true.
     */
    gestureEnabled?: boolean;
    /**
     * @description A callback that gets called when the current screen appears.
     */
    onAppear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
    onComponentRef?: (view: unknown) => void;
    /**
     * @description A callback that gets called when the current screen disappears.
     */
    onDisappear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
    /**
     * @description A callback that gets called when the current screen is dismissed by hardware back (on Android) or dismiss gesture (swipe back or down). The callback takes no arguments.
     */
    onDismissed?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
    /**
     * @description A callback that gets called when the current screen will appear. This is called as soon as the transition begins.
     */
    onWillAppear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
    /**
     * @description A callback that gets called when the current screen will disappear. This is called as soon as the transition begins.
     */
    onWillDisappear?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
    /**
     * @description Allows for the customization of the type of animation to use when this screen replaces another screen at the top of the stack. The following values are currently supported:
     *  @type "push" – performs push animation
     *  @type "pop" – performs pop animation (default)
     */
    replaceAnimation?: ScreenReplaceTypes;
    /**
     * @description Allows for the customization of how the given screen should appear/dissapear when pushed or popped at the top of the stack. The following values are currently supported:
     *  @type "default" – uses a platform default animation
     *  @type "fade" – fades screen in or out
     *  @type "flip" – flips the screen, requires stackPresentation: "modal" (iOS only)
     *  @type "none" – the screen appears/dissapears without an animation
     */
    stackAnimation?: StackAnimationTypes;
    /**
     * @type "push" – the new screen will be pushed onto a stack which on iOS means that the default animation will be slide from the side, the animation on Android may vary depending on the OS version and theme.
     * @type "modal" – the new screen will be presented modally. In addition this allow for a nested stack to be rendered inside such screens.
     * @type "transparentModal" – the new screen will be presented modally but in addition the second to last screen will remain attached to the stack container such that if the top screen is non opaque the content below can still be seen. If "modal" is used instead the below screen will get unmounted as soon as the transition ends.
     * @type "containedModal" – will use "UIModalPresentationCurrentContext" modal style on iOS and will fallback to "modal" on Android.
     * @type "containedTransparentModal" – will use "UIModalPresentationOverCurrentContext" modal style on iOS and will fallback to "transparentModal" on Android.
     * @type "fullScreenModal" – will use "UIModalPresentationFullScreen" modal style on iOS and will fallback to "modal" on Android.
     * @type "formSheet" – will use "UIModalPresentationFormSheet" modal style on iOS and will fallback to "modal" on Android.
     */
    stackPresentation?: StackPresentationTypes;
  }

  export interface ScreenContainerProps extends ViewProps {
    /**
     * @description A prop that gives users an option to switch between using Screens for the navigator (container). All children screens should have the same value of their "enabled" prop as their container.
     */
    enabled?: boolean;
  }

  export interface ScreenStackProps extends ViewProps {
    /**
     * @description A callback that gets called when the current screen finishes its transition.
     */
    onFinishTransitioning?: (e: NativeSyntheticEvent<NativeTouchEvent>) => void;
  }

  export interface ScreenStackHeaderConfigProps extends ViewProps {
    /**
     * @description Whether to show the back button with a custom left side of the header.
     */
    backButtonInCustomView?: boolean;
    /**
     * @description Controls the color of the navigation header.
     */
    backgroundColor?: string;
    /**
     * @host (iOS only)
     * @description Allows for controlling the string to be rendered next to back button. By default iOS uses the title of the previous screen.
     */
    backTitle?: string;
    /**
     * @host (iOS only)
     * @description Allows for customizing font family to be used for back button title on iOS.
     */
    backTitleFontFamily?: string;
    /**
     * @host (iOS only)
     * @description Allows for customizing font size to be used for back button title on iOS.
     */
    backTitleFontSize?: number;
    /**
     * @host (iOS only)
     * @description Blur effect to be applied to the header. Works with backgroundColor's alpha < 1.
     */
    blurEffect?: BlurEffectTypes;
    /**
     * Pass HeaderLeft, HeaderRight and HeaderTitle
     */
    children?: React.ReactNode;
    /**
     *@description Controls whether the stack should be in rtl or ltr form.
     */
    direction?: 'rtl' | 'ltr';
    /**
     * @description When set to true the header will be hidden while the parent Screen is on the top of the stack. The default value is false.
     */
    hidden?: boolean;
    /**
     * @description Controls the color of items rendered on the header. This includes back icon, back text (iOS only) and title text. If you want the title to have different color use titleColor property.
     */
    color?: string;
    /**
     * @description If set to true the back button will not be rendered as a part of navigation header.
     */
    hideBackButton?: boolean;
    /**
     * @description Boolean that allows for disabling drop shadow under navigation header. The default value is true.
     */
    hideShadow?: boolean;
    /**
     * @host (iOS only)
     * @description When set to true it makes the title display using the large title effect.
     */
    largeTitle?: boolean;
    /**
     *@description Controls the color of the navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
     */
    largeTitleBackgroundColor?: string;
    /**
     * @host (iOS only)
     * @description Customize the color to be used for the large title. By default uses the titleColor property.
     */
    largeTitleColor?: string;
    /**
     * @host (iOS only)
     * @description Customize font family to be used for the large title.
     */
    largeTitleFontFamily?: string;
    /**
     * @host (iOS only)
     * @description Customize the size of the font to be used for the large title.
     */
    largeTitleFontSize?: number;
    /**
     * @description Boolean that allows for disabling drop shadow under navigation header when the edge of any scrollable content reaches the matching edge of the navigation bar.
     */
    largeTitleHideShadow?: boolean;
    /**
     * @host (iOS only)
     * @description Sets the status bar animation (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. Defaults to `fade`.
     */
    statusBarAnimation?: 'none' | 'fade' | 'slide';
    /**
     * @host (iOS only)
     * @description When set to true, the status bar for this screen is hidden. Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. Defaults to `false`.
     */
    statusBarHidden?: boolean;
    /**
     * @host (iOS only)
     * @description Sets the status bar color (similar to the `StatusBar` component). Requires enabling (or deleting) `View controller-based status bar appearance` in your Info.plist file. Defaults to `auto`.
     */
    statusBarStyle?: 'inverted' | 'auto' | 'light' | 'dark';
    /**
     * @description String that representing screen title that will get rendered in the middle section of the header. On iOS the title is centered on the header while on Android it is aligned to the left and placed next to back button (if one is present).
     */
    title?: string;
    /**
     * @description Allows for setting text color of the title.
     */
    titleColor?: string;
    /**
     * @description Customize font family to be used for the title.
     */
    titleFontFamily?: string;
    /**
     * @description Customize the size of the font to be used for the title.
     */
    titleFontSize?: number;
    /**
     * @host (Android only)
     * @description A flag to that lets you opt out of insetting the header. You may want to set this to `false` if you use an opaque status bar. Defaults to `true`.
     */
    topInsetEnabled?: boolean;
    /**
     * @description When set to true, it makes native navigation bar on iOS semi transparent with blur effect. It is a common way of presenting navigation bar introduced in iOS 11. The default value is false
     */
    translucent?: boolean;
  }

  export const Screen: ComponentClass<ScreenProps>;
  export const ScreenContainer: ComponentClass<ScreenContainerProps>;
  export const NativeScreen: ComponentClass<ScreenProps>;
  export const NativeScreenContainer: ComponentClass<ScreenContainerProps>;
  export const ScreenStack: ComponentClass<ScreenStackProps>;
  export const ScreenStackHeaderBackButtonImage: ComponentClass<ImageProps>;
  export const ScreenStackHeaderLeftView: ComponentClass<ViewProps>;
  export const ScreenStackHeaderRightView: ComponentClass<ViewProps>;
  export const ScreenStackHeaderCenterView: ComponentClass<ViewProps>;
  export const ScreenStackHeaderConfig: ComponentClass<ScreenStackHeaderConfigProps>;
  export const shouldUseActivityState: boolean;
}

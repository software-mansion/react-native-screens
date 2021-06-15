import React from 'react';
import { Animated, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { NavigationRouteConfigMap, CreateNavigatorConfig, NavigationStackRouterConfig, NavigationState, NavigationNavigator, NavigationProp } from 'react-navigation';
import { NativeStackNavigationOptions as NativeStackNavigationOptionsV5 } from './native-stack/types';
import { StackNavigationProp, Layout } from 'react-navigation-stack/src/vendor/types';
export declare type NativeStackNavigationProp = StackNavigationProp;
export declare type NativeStackNavigationOptions = StackNavigatorOptions & NativeStackNavigationOptionsV5 & BackButtonProps & {
    onWillAppear?: () => void;
    onAppear?: () => void;
    onWillDisappear?: () => void;
    onDisappear?: () => void;
    /** Use `headerHideShadow` to be consistent with v5 `native-stack` */
    hideShadow?: boolean;
    /** Use `headerLargeTitle` to be consistent with v5 `native-stack` */
    largeTitle?: boolean;
    /** Use `headerLargeTitleHideShadow` to be consistent with v5 `native-stack` */
    largeTitleHideShadow?: boolean;
    /** Use `headerTranslucent` to be consistent with v5 `native-stack` */
    translucent?: boolean;
};
declare type StackNavigatorOptions = {
    /** This is an option from `stackNavigator` and it hides the header when set to `null`. Use `headerShown` instead to be consistent with v5 `native-stack`. */
    header?: React.ComponentType<Record<string, unknown>> | null;
    /** This is an option from `stackNavigator` and it controls the stack presentation along with `mode` prop. Use `stackPresentation` instead to be consistent with v5 `native-stack` */
    cardTransparent?: boolean;
    /** This is an option from `stackNavigator` and it sets stack animation to none when `false` passed. Use `stackAnimation: 'none'` instead to be consistent with v5 `native-stack` */
    animationEnabled?: boolean;
    cardStyle?: StyleProp<ViewStyle>;
};
declare type BackButtonProps = {
    headerBackImage?: (props: {
        tintColor: string;
    }) => React.ReactNode;
    headerPressColorAndroid?: string;
    headerTintColor?: string;
    backButtonTitle?: string;
    truncatedBackButtonTitle?: string;
    backTitleVisible?: boolean;
    headerBackTitleStyle?: Animated.WithAnimatedValue<StyleProp<TextStyle>>;
    layoutPreset?: Layout;
};
declare type NativeStackNavigationConfig = {
    /** This is an option from `stackNavigator` and controls the stack presentation along with `cardTransparent` prop. Use `stackPresentation` instead to be consistent with v5 `native-stack` */
    mode?: 'modal' | 'containedModal';
    /** This is an option from `stackNavigator` and makes the header hide when set to `none`. Use `headerShown` instead to be consistent with v5 `native-stack` */
    headerMode?: 'none';
    /** This is an option from `stackNavigator` and controls the stack presentation along with `mode` prop. Use `stackPresentation` instead to be consistent with v5 `native-stack` */
    transparentCard?: boolean;
};
declare function createStackNavigator(routeConfigMap: NavigationRouteConfigMap<NativeStackNavigationOptions, StackNavigationProp>, stackConfig?: CreateNavigatorConfig<NativeStackNavigationConfig, NavigationStackRouterConfig, NativeStackNavigationOptions, StackNavigationProp>): NavigationNavigator<Record<string, unknown>, NavigationProp<NavigationState>>;
export default createStackNavigator;

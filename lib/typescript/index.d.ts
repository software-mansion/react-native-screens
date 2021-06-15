import React from 'react';
import { Animated, ViewProps, ImageProps } from 'react-native';
import { ScreenProps, ScreenContainerProps, ScreenStackProps, ScreenStackHeaderConfigProps, HeaderSubviewTypes, SearchBarProps } from './types';
export * from './types';
export declare function enableScreens(shouldEnableScreens?: boolean): void;
export declare function screensEnabled(): boolean;
export declare class NativeScreen extends React.Component<ScreenProps> {
    render(): JSX.Element;
}
export declare const Screen: Animated.AnimatedComponent<typeof NativeScreen>;
export declare const ScreenContainer: React.ComponentType<ScreenContainerProps>;
export declare const NativeScreenContainer: React.ComponentType<ScreenContainerProps>;
export declare const ScreenStack: React.ComponentType<ScreenStackProps>;
export declare const ScreenStackHeaderBackButtonImage: (props: ImageProps) => JSX.Element;
export declare const ScreenStackHeaderRightView: (props: React.PropsWithChildren<ViewProps>) => JSX.Element;
export declare const ScreenStackHeaderLeftView: (props: React.PropsWithChildren<ViewProps>) => JSX.Element;
export declare const ScreenStackHeaderCenterView: (props: React.PropsWithChildren<ViewProps>) => JSX.Element;
export declare const ScreenStackHeaderSearchBarView: (props: React.PropsWithChildren<SearchBarProps>) => JSX.Element;
export declare const ScreenStackHeaderConfig: React.ComponentType<ScreenStackHeaderConfigProps>;
export declare const SearchBar: React.ComponentType<SearchBarProps>;
export declare const ScreenStackHeaderSubview: React.ComponentType<React.PropsWithChildren<ViewProps & {
    type?: HeaderSubviewTypes;
}>>;
export declare const shouldUseActivityState = true;

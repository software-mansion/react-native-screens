import { StackNavigationState, ParamListBase } from '@react-navigation/native';
import * as React from 'react';
import { NativeStackNavigationEventMap, NativeStackNavigationOptions, NativeStackNavigatorProps } from '../types';
declare function NativeStackNavigator({ initialRouteName, children, screenOptions, ...rest }: NativeStackNavigatorProps): React.JSX.Element;
declare const _default: <ParamList extends Record<string, object | undefined>>() => import("@react-navigation/native").TypedNavigator<ParamList, StackNavigationState<ParamListBase>, NativeStackNavigationOptions, NativeStackNavigationEventMap, typeof NativeStackNavigator>;
export default _default;

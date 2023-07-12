import * as React from 'react';
import { ParamListBase, StackNavigationState } from '@react-navigation/native';
import { NativeStackDescriptorMap, NativeStackNavigationHelpers } from '../types';
declare type Props = {
    state: StackNavigationState<ParamListBase>;
    navigation: NativeStackNavigationHelpers;
    descriptors: NativeStackDescriptorMap;
};
export default function NativeStackView(props: Props): React.JSX.Element;
export {};

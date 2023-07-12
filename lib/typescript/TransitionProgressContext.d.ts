import * as React from 'react';
import { Animated } from 'react-native';
declare type TransitionProgressContextBody = {
    progress: Animated.Value;
    closing: Animated.Value;
    goingForward: Animated.Value;
};
declare const _default: React.Context<TransitionProgressContextBody | undefined>;
export default _default;

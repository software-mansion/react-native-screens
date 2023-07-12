import * as React from 'react';
import Animated from 'react-native-reanimated';
declare type ReanimatedTransitionProgressContextBody = {
    progress: Animated.SharedValue<number>;
    closing: Animated.SharedValue<number>;
    goingForward: Animated.SharedValue<number>;
};
declare const _default: React.Context<ReanimatedTransitionProgressContextBody | undefined>;
export default _default;

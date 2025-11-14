import * as React from 'react';
// @ts-ignore file to be used only if `react-native-reanimated` available in the project
import { SharedValue } from 'react-native-reanimated';

type ReanimatedTransitionProgressContextBody = {
  progress: SharedValue<number>;
  closing: SharedValue<number>;
  goingForward: SharedValue<number>;
};

export default React.createContext<
  ReanimatedTransitionProgressContextBody | undefined
>(undefined);

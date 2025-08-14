import { View, ViewProps } from 'react-native';

interface NativeProps extends ViewProps {}

export const StackScreenLifecycleState = {
  INITIAL: 0,
  DETACHED: 1,
  ATTACHED: 2,
} as const;

export type StackScreenNativeProps = NativeProps & {
  // Overrides
  maxLifecycleState: (typeof StackScreenLifecycleState)[keyof typeof StackScreenLifecycleState];
};

const StackScreen = View;

export default StackScreen;

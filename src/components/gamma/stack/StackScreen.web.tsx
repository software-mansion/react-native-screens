import { View } from 'react-native';

export const StackScreenLifecycleState = {
  INITIAL: 0,
  DETACHED: 1,
  ATTACHED: 2,
} as const;

const StackScreen = View;

export default StackScreen;

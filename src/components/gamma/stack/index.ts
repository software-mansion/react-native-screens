import StackHost from './StackHost';
import StackScreen from './StackScreen';

export { StackScreenLifecycleState } from './StackScreen';

export * from './StackHost.types';
export * from './StackScreen.types';

const Stack = {
  Host: StackHost,
  Screen: StackScreen,
};

export default Stack;

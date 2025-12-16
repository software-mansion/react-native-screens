import ScreenStackHost from './ScreenStackHost';
import StackScreen from './StackScreen';

export { StackScreenLifecycleState } from './StackScreen';

export * from './ScreenStackHost.types';
export * from './StackScreen.types';

const Stack = {
  Host: ScreenStackHost,
  Screen: StackScreen,
};

export default Stack;

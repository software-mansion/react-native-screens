import StackHost from './StackHost';
import StackScreen from './StackScreen';

export * from './StackHost.types';
export * from './StackScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Stack = {
  Host: StackHost,
  Screen: StackScreen,
};

export default Stack;

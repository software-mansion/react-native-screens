import StackHost from './StackHost';
import StackScreen from './StackScreen';
import StackHeaderConfig from './header/StackHeaderConfig';

export * from './StackHost.types';
export * from './StackScreen.types';
export * from './header/StackHeaderConfig.types';
export * from './header/StackHeaderSubview.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Stack = {
  Host: StackHost,
  Screen: StackScreen,
  HeaderConfig: StackHeaderConfig,
};

export default Stack;

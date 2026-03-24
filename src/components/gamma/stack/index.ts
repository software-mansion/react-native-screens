import StackHost from './StackHost';
import StackScreen from './StackScreen';
import StackHeaderConfiguration from './header/StackHeaderConfiguration';
import StackHeaderSubview from './header/StackHeaderSubview';

export * from './StackHost.types';
export * from './StackScreen.types';
export * from './header/StackHeaderConfiguration.types';
export * from './header/StackHeaderSubview.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Header = {
  Configuration: StackHeaderConfiguration,
  Subview: StackHeaderSubview,
};

const Stack = {
  Host: StackHost,
  Screen: StackScreen,
  Header,
};

export default Stack;

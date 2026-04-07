import StackHost from './StackHost';
import StackScreen from './StackScreen';
import StackHeaderConfig from './header/StackHeaderConfig';

export type { StackHostProps } from './StackHost.types';

export type {
  OnDismissEventPayload,
  EmptyEventPayload, // TODO: Remove this from public types (we need one shared type for this)
  OnDismissEvent,
  StackScreenActivityMode,
  StackScreenEventHandler,
  StackScreenProps,
} from './StackScreen.types';

export type {
  StackHeaderTypeAndroid,
  StackHeaderToolbarSubviewAndroid,
  StackHeaderBackgroundSubviewCollapseModeAndroid,
  StackHeaderBackgroundSubviewAndroid,
  StackHeaderConfigProps,
} from './header/StackHeaderConfig.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export const Stack = {
  Host: StackHost,
  Screen: StackScreen,
  HeaderConfig: StackHeaderConfig,
};

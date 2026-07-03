import { StackHost } from './host';
import { StackScreen } from './screen';
import { StackHeaderConfig } from './header';

export type { StackHostProps } from './host';

export type {
  OnDismissEventPayload,
  EmptyEventPayload, // TODO: Remove this from public types (we need one shared type for this)
  OnDismissEvent,
  StackScreenActivityMode,
  StackScreenEventHandler,
  StackScreenProps,
} from './screen';

export type {
  StackHeaderConfigPropsBase,
  StackHeaderConfigProps,
  StackHeaderConfigRef,
  // Android
  StackHeaderTypeAndroid,
  StackHeaderBackgroundSubviewCollapseModeAndroid,
  StackHeaderToolbarSubviewAndroid,
  StackHeaderBackgroundSubviewAndroid,
  StackHeaderConfigPropsAndroid,
  StackHeaderConfigCommandsAndroid,
  StackHeaderToolbarMenuAndroid,
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderToolbarMenuElementAndroid,
  StackHeaderToolbarMenuGroupAndroid,
  StackHeaderToolbarMenuItemAndroid,
  StackHeaderToolbarMenuItemBaseAndroid,
  StackHeaderToolbarMenuElementOptionsAndroid,
  StackHeaderToolbarMenuItemShowAsActionAndroid,
  StackHeaderToolbarMenuItemTypeAndroid,
  // iOS
  StackHeaderConfigPropsIOS,
  StackHeaderInlineItemIOS,
  StackHeaderInlineCustomItemIOS,
  StackHeaderTitleCustomItemIOS,
  StackHeaderSpacerItemIOS,
  StackHeaderConfigCommandsIOS,
  StackHeaderMenuIOS,
  StackHeaderMenuItemIOS,
  StackHeaderMenuElementIOS,
} from './header';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export const Stack = {
  Host: StackHost,
  Screen: StackScreen,
  HeaderConfig: StackHeaderConfig,
};

/*
 * Core
 */
export {
  enableScreens,
  enableFreeze,
  screensEnabled,
  freezeEnabled,
  shouldUseActivityState,
} from './core';

/*
 * RNS Components
 */
export {
  default as Screen,
  NativeScreen,
  InnerScreen,
  ScreenContext,
} from './components/Screen';

export {
  default as ScreenContainer,
  NativeScreenContainer,
  NativeScreenNavigationContainer,
} from './components/ScreenContainer';

export { default as ScreenStack } from './components/ScreenStack';

export {
  NativeScreenStackHeaderConfig as ScreenStackHeaderConfig,
  NativeScreenStackHeaderSubview as ScreenStackHeaderSubview,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderSearchBarView,
} from './components/ScreenStackHeaderConfig';

export {
  default as SearchBar,
  NativeSearchBar,
  NativeSearchBarCommands as SearchBarCommands,
} from './components/SearchBar';

export { default as FullWindowOverlay } from './components/FullWindowOverlay';

/*
 * Utils
 */
export {
  isSearchBarAvailableForCurrentPlatform,
  isNewBackTitleImplementation,
  executeNativeBackPress,
} from './utils';

/*
 * Hooks
 */
export { default as useTransitionProgress } from './useTransitionProgress';

/*
 * Types
 */
export type {
  StackPresentationTypes,
  StackAnimationTypes,
  BlurEffectTypes,
  ScreenReplaceTypes,
  ScreenOrientationTypes,
  HeaderSubviewTypes,
  ScreenProps,
  ScreenContainerProps,
  ScreenStackProps,
  ScreenStackHeaderConfigProps,
  SearchBarProps,
} from './types';

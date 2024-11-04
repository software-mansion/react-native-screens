// Side effects import declaration to ensure our TurboModule
// is loaded.
import './fabric/NativeScreensModule';

export * from './types';

/**
 * Core
 */
export {
  enableScreens,
  enableFreeze,
  screensEnabled,
  freezeEnabled,
} from './core';

/**
 * RNS Components
 */
export {
  default as Screen,
  InnerScreen,
  ScreenContext,
} from './components/Screen';

export {
  ScreenStackHeaderConfig,
  ScreenStackHeaderSubview,
  ScreenStackHeaderLeftView,
  ScreenStackHeaderCenterView,
  ScreenStackHeaderRightView,
  ScreenStackHeaderBackButtonImage,
  ScreenStackHeaderSearchBarView,
} from './components/ScreenStackHeaderConfig';

export { default as SearchBar } from './components/SearchBar';
export { default as ScreenContainer } from './components/ScreenContainer';
export { default as ScreenStack } from './components/ScreenStack';
export { default as ScreenStackItem } from './components/ScreenStackItem';
export { default as FullWindowOverlay } from './components/FullWindowOverlay';
export { default as ScreenFooter } from './components/ScreenFooter';
export { default as ScreenContentWrapper } from './components/ScreenContentWrapper';

/**
 * Utils
 */
export {
  isSearchBarAvailableForCurrentPlatform,
  compatibilityFlags,
  executeNativeBackPress,
} from './utils';

/**
 * Hooks
 */
export { default as useTransitionProgress } from './useTransitionProgress';

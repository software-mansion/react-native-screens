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

// NativeModules are not imported anywhere, but need to stay here so the TurboModule is registered
export { default as NativeModules } from './fabric/NativeScreensModule';
export { default as SearchBar } from './components/SearchBar';
export { default as ScreenContainer } from './components/ScreenContainer';
export { default as ScreenStack } from './components/ScreenStack';
export { default as FullWindowOverlay } from './components/FullWindowOverlay';
export { default as ScreenFooter } from './components/ScreenFooter';
export { default as ScreenContentWrapper } from './components/ScreenContentWrapper';

/**
 * Contexts
 */
export { GHContext } from './native-stack/contexts/GHContext';

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

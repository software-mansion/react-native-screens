/**
 * Core
 */
export {
  enableScreens,
  enableFreeze,
  screensEnabled,
  freezeEnabled,
  // For a platform this library ships no native code for, which registers the
  // components itself. See core.ts for why this is not `enableScreens`.
  provideNativeScreens,
  nativeScreensAvailable,
} from '../core';

/**
 * Types
 */

export type * from './types';

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
 * Hooks
 */
export { default as useTransitionProgress } from './useTransitionProgress';

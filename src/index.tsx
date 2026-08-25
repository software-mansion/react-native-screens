// Side effects import declaration to ensure our TurboModule
// is loaded.
import './fabric/NativeScreensModule';

export * from './legacy';

/**
 * Utils
 */
export {
  isSearchBarAvailableForCurrentPlatform,
  executeNativeBackPress,
} from './utils';

/**
 * Flags
 */
export { compatibilityFlags, featureFlags } from './flags';

export * from './components/tabs';
export * from './components/stack';
export * from './components/split';
export * from './components/scroll-view-marker';
export * from './components/modals/form-sheet';

export type * from './types';

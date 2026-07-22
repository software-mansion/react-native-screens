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
export type * from './types';

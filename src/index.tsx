// Side effects import declaration to ensure our TurboModule
// is loaded.
import './fabric/NativeScreensModule';

export * from './legacy';

export * from './types';

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
export type * from './components/shared/types';

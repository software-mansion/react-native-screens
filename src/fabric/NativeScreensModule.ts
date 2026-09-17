'use client';

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Height of a standard navigation bar for the current environment, as
   * reported by the platform. It does not include the status bar, and it does
   * not describe a modally presented bar.
   *
   * Returns 0 when the platform cannot answer synchronously.
   */
  getNavigationBarHeight(): number;
}

export default TurboModuleRegistry.get<Spec>('RNSModule');

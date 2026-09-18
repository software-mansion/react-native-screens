'use client';

import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  /**
   * Height of a standard stack header for the current window, as UIKit lays
   * it out: the navigation bar plus whatever sits above it (status bar or the
   * bar's own top inset). Same definition as the `headerHeight` reported by
   * `onHeaderHeightChange`, available synchronously before any stack mounts.
   *
   * Measured for the key window's traits and bounds. A modally presented bar
   * is not described. Call it during render, not from an effect, since it
   * waits on the main queue.
   *
   * Returns 0 when the platform cannot answer synchronously.
   */
  getHeaderHeight(): number;
}

export default TurboModuleRegistry.get<Spec>('RNSModule');

import React from 'react';
import type { ScrollToTopGuardProps } from './ScrollToTopGuard.types';

/**
 * Temporary workaround for an issue on `react-native`'s side.
 *
 * @remarks
 * The component will be removed in the future.
 *
 * Falls back to `React.Fragment` on platforms other than iOS.
 *
 * @see {@link https://github.com/react/react-native/issues/56061 | The issue report}
 * @platform ios >= 26
 * @experimental
 */
function ScrollToTopGuard({ children }: ScrollToTopGuardProps) {
  return <>{children}</>;
}

export { ScrollToTopGuard };

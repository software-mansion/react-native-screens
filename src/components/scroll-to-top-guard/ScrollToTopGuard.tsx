import React from 'react';
import { ViewProps } from 'react-native';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * This is an **experimental, unstable** component which might be subject to
 * breaking changes and will be removed in the future. It is meant to be used
 * only as a temporary workaround until the issue is fixed on `react-native`'s
 * side. The issue report: https://github.com/react/react-native/issues/56061.
 *
 * Falls back to `React.Fragment` on platforms other than iOS.
 */
function ScrollToTopGuard({ children }: ViewProps) {
  return <>{children}</>;
}

export { ScrollToTopGuard };

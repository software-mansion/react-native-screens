'use client';

import React from 'react';
import type { ViewProps } from 'react-native';
import ScrollToTopGuardNativeComponent from '../../fabric/scroll-to-top-guard/ScrollToTopGuardNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * This is an **experimental, unstable** component which might be subject to
 * breaking changes and will be removed in the future. It is meant to be used
 * only as a temporary workaround until the issue is fixed on `react-native`'s
 * side. The issue report: https://github.com/react/react-native/issues/56061.
 */
export function ScrollToTopGuard(props: ViewProps) {
  return <ScrollToTopGuardNativeComponent {...props} collapsable={false} />;
}

'use client';

import React from 'react';
import type { ViewProps } from 'react-native';
import ScrollToTopGuardNativeComponent from '../../fabric/scroll-to-top-guard/ScrollToTopGuardNativeComponent';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export function ScrollToTopGuard(props: ViewProps) {
  return <ScrollToTopGuardNativeComponent {...props} collapsable={false} />;
}

'use client';

import React from 'react';
import ScrollToTopGuardNativeComponent from '../../fabric/scroll-to-top-guard/ScrollToTopGuardNativeComponent';
import type { ScrollToTopGuardProps } from './ScrollToTopGuard.types';

export function ScrollToTopGuard(props: ScrollToTopGuardProps) {
  return <ScrollToTopGuardNativeComponent {...props} collapsable={false} />;
}

'use client';

import React from 'react';
import ScrollViewWrapperNativeComponent from '../fabric/ScrollViewWrapperNativeComponent';

function ScrollViewWrapper({ children }: { children?: React.ReactNode }) {
  return <ScrollViewWrapperNativeComponent>{children}</ScrollViewWrapperNativeComponent>;
}

export default ScrollViewWrapper;

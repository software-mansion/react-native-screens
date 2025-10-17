'use client';

import React from 'react';
import DummyNativeComponent from '../fabric/DummyNativeComponent';

function DummyComponent({ children }: { children?: React.ReactNode }) {
  return <DummyNativeComponent>{children}</DummyNativeComponent>;
}

export default DummyComponent;

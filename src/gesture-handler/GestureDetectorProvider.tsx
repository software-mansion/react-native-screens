import React from 'react';
import { GHContext, GestureProviderProps } from '../types';
import ScreenGestureDetector from './ScreenGestureDetector';

function GHWrapper(props: GestureProviderProps) {
  return <ScreenGestureDetector {...props} />;
}

export default function GestureDetectorProvider(props: {
  children: React.ReactNode;
}) {
  return (
    <GHContext.Provider value={GHWrapper}>{props.children}</GHContext.Provider>
  );
}

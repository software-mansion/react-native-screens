import React from 'react';
import { GestureProviderProps } from '../types';
import { GHContext } from '../contexts';
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

import React from 'react';
import { GHContext } from '../index';
import GestureDetector from './GestureDetector';
import type { GestureProviderProps } from './GestureDetector';

function GHWrapper(props: GestureProviderProps) {
  return <GestureDetector {...props} />;
}

export default function GestureDetectorProvider(props: GestureProviderProps) {
  return (
    <GHContext.Provider value={GHWrapper as any}>
      {props.children}
    </GHContext.Provider>
  );
}

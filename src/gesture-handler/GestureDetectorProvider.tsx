import React from 'react';
import { GHContext } from '../index';
import GestureDetector from './GestureDetector';
import type { GestureProviderProps } from '../native-stack/types';

function GHWrapper(props: GestureProviderProps) {
  return <GestureDetector {...props} />;
}

export default function GestureDetectorProvider(props: GestureProviderProps) {
  return (
    <GHContext.Provider value={GHWrapper}>{props.children}</GHContext.Provider>
  );
}

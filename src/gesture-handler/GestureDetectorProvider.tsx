import React from 'react';
import { GHContext } from '../index';
import GestureDetector from './GestureDetector';
import type { GestureProviderProps } from '../native-stack/types';

function GHWrapper(props: GestureProviderProps) {
  return <GestureDetector {...props} />;
}

export default function GestureDetectorProvider(props: {
  children: React.ReactNode;
}) {
  return (
    <GHContext.Provider value={GHWrapper}>{props.children}</GHContext.Provider>
  );
}

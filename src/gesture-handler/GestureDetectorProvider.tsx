import React, { PropsWithChildren } from 'react';
import { GHContext } from 'react-native-screens';
import GestureDetector from './GestureDetector';

function GHWrapper(props) {
  return <GestureDetector {...props} />;
}

export default function GestureDetectorProvider(
  props: PropsWithChildren<unknown>
) {
  return (
    <GHContext.Provider value={GHWrapper as any}>
      {props.children}
    </GHContext.Provider>
  );
}

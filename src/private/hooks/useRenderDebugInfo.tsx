import React from 'react';
import { findNodeHandle, ReactNativeElement } from 'react-native';

export type NativeComponentGenericRef = React.Component & ReactNativeElement;

// A hook that logs information when component is rendered, mounted and unmounted.
// It returns a ref that can be passed to a component instance in order to
// enrich the logging information with the component's node handle.
export function useRenderDebugInfo<RefType extends React.Component>(
  componentName: string,
) {
  const componentRef = React.useRef<RefType>(null);
  const componentNodeHandle = React.useRef<number>(-1);

  const logMessageEvent = React.useEffectEvent((message: string) => {
    logMessage(componentName, componentNodeHandle.current, message);
  });

  React.useEffect(() => {
    if (componentRef.current != null) {
      componentNodeHandle.current = findNodeHandle(componentRef.current) ?? -1;

      if (componentNodeHandle.current === -1) {
        logMessageEvent('failed to find node handle');
      }
    }

    logMessageEvent('mounted');

    return () => {
      logMessageEvent('unmounted');
    };
  }, []);

  logMessage(componentName, componentNodeHandle.current, 'rendered');

  return componentRef;
}

function logMessage(
  componentName: string,
  nodeHandle: number,
  message: string,
) {
  console.log(`${componentName} [${nodeHandle}] ${message}`);
}

import React, { useMemo } from 'react';
import ScreenNativeComponent from './ScreenNativeComponent';
import { StyleSheet } from 'react-native';

function Screen(props, ref) {
  // Codegen doesn't handle well array nested types
  // So we have to provide default values for optional properties
  const sharedElementTransitions = useMemo(
    () =>
      props.sharedElementTransitions?.map((transition) => ({
        ...DEFAULT_SHARED_ELEMENT_TRANSITION,
        ...transition,
      })),
    [props.sharedElementTransitions]
  );
  return (
    <ScreenNativeComponent
      ref={ref}
      {...props}
      sharedElementTransitions={sharedElementTransitions}
      style={[props.style, StyleSheet.absoluteFill]}
    />
  );
}

export default React.forwardRef(Screen);

const DEFAULT_SHARED_ELEMENT_TRANSITION = {
  delay: 0,
  duration: 0,
  damping: 1,
  initialVelocity: 0,
  easing: 'linear',
  resizeMode: 'resize',
  align: 'left-top',
  showFromElementDuringAnimation: false,
  showToElementDuringAnimation: false,
};

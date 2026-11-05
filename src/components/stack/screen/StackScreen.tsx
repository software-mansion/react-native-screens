import React from 'react';
import { processColor, StyleSheet } from 'react-native';
import StackScreenNativeComponent, {
  type NativeProps,
} from '../../../fabric/stack/StackScreenNativeComponent';
import { OnDismissEvent, StackScreenProps } from './StackScreen.types';
import type {
  StackScreenAnimation,
  StackScreenAnimationMotion,
  StackScreenAnimationTransition,
} from './animation';
import { useRenderDebugInfo } from '../../../private';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function StackScreen({
  children,
  // Control
  activityMode,
  screenKey,
  // Events
  onWillAppear,
  onWillDisappear,
  onDidAppear,
  onDidDisappear,
  onDismiss,
  onNativeDismiss,
  onNativeDismissPrevented,
  // Configuration
  preventNativeDismiss,
  animation,
  replaceAnimation,
}: StackScreenProps) {
  const onDismissWrapper = React.useCallback(
    (event: OnDismissEvent) => {
      if (event.nativeEvent.isNativeDismiss) {
        onNativeDismiss?.(screenKey);
      } else {
        onDismiss?.(screenKey);
      }
    },
    [onDismiss, onNativeDismiss, screenKey],
  );

  const componentRef = useRenderDebugInfo(
    React.useMemo(() => `StackScreen (${screenKey})`, [screenKey]),
  );

  const nativeAnimation = React.useMemo(
    () => parseAnimationToNativeProp(animation),
    [animation],
  );

  return (
    <StackScreenNativeComponent
      // @ts-ignore - debug only
      ref={componentRef}
      style={StyleSheet.absoluteFill}
      // Control
      activityMode={activityMode}
      screenKey={screenKey}
      // Events
      onWillAppear={onWillAppear}
      onDidAppear={onDidAppear}
      onWillDisappear={onWillDisappear}
      onDidDisappear={onDidDisappear}
      onDismiss={onDismissWrapper}
      onNativeDismissPrevented={onNativeDismissPrevented}
      // Configuration
      preventNativeDismiss={preventNativeDismiss}
      animation={nativeAnimation}
      replaceAnimation={replaceAnimation}>
      {children}
    </StackScreenNativeComponent>
  );
}

type NativeAnimation = NativeProps['animation'];
type NativeTransition = Extract<NativeAnimation, { type: 'custom' }>['push'];
type NativeMotion = Extract<NativeTransition, { type: 'custom' }>['enter'];

/**
 * Processes the colors the value carries (the `color` of a `dim` track); everything else
 * reaches native as written, `null` included (native reads it as an omitted value).
 */
function parseAnimationToNativeProp(
  animation: StackScreenAnimation | undefined,
): NativeAnimation {
  if (
    animation == null ||
    typeof animation !== 'object' ||
    animation.type !== 'custom'
  ) {
    return animation;
  }
  return {
    ...animation,
    push: parseTransitionToNativeProp(animation.push),
    pop: parseTransitionToNativeProp(animation.pop),
  };
}

function parseTransitionToNativeProp(
  transition: StackScreenAnimationTransition | undefined,
): NativeTransition {
  if (
    transition == null ||
    typeof transition !== 'object' ||
    transition.type !== 'custom'
  ) {
    return transition;
  }
  return {
    ...transition,
    enter: parseMotionToNativeProp(transition.enter),
    exit: parseMotionToNativeProp(transition.exit),
  };
}

function parseMotionToNativeProp(
  motion: StackScreenAnimationMotion | undefined,
): NativeMotion {
  if (
    motion == null ||
    typeof motion !== 'object' ||
    motion.type !== 'custom'
  ) {
    return motion;
  }
  const { dim, ...tracks } = motion;
  if (dim == null) {
    return tracks;
  }
  return { ...tracks, dim: { ...dim, color: processColor(dim.color) } };
}

export default StackScreen;

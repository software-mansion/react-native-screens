import React from 'react';
import { StyleSheet } from 'react-native';
import FormSheetHostNativeComponent from '../../../fabric/modals/form-sheet/FormSheetHostNativeComponent';
import FormSheetContentWrapperNativeComponent from '../../../fabric/modals/form-sheet/FormSheetContentWrapperNativeComponent';
import type { SheetProps } from './Sheet.types';
import {
  resolveInitialDetentIndex,
  resolveLargestUndimmedDetentIndex,
  resolveNativeBackgroundEffect,
  resolveNativeCornerRadius,
  resolveNativeDetents,
} from './SheetUtils';

/**
 * UIKit `modalPresentationStyle` the sheet host presents with. Pinned by each
 * public sheet component; never exposed on their props.
 */
export type SheetPresentationStyle = 'formSheet' | 'pageSheet';

export interface SheetBaseProps extends SheetProps {
  presentationStyle: SheetPresentationStyle;
}

/**
 * Shared implementation of the sheet modals (`FormSheet`, `PageSheet`), backed
 * by `UISheetPresentationController` on iOS and `BottomSheetDialog` on Android.
 * Resolves the public props to their native representation and mounts the
 * shared native host.
 */
export function SheetBase(props: SheetBaseProps) {
  const {
    children,
    detents,
    initialDetentIndex,
    largestUndimmedDetentIndex,
    preferredCornerRadius,
    nativeContainerStyle,
    backgroundEffect,
    presentationStyle,
    ...rest
  } = props;

  const nativeCornerRadius = resolveNativeCornerRadius(preferredCornerRadius);
  const nativeDetents = resolveNativeDetents(detents);

  const detentsCount = nativeDetents?.length ?? 0;

  const resolvedInitialDetentIndex = resolveInitialDetentIndex(
    initialDetentIndex,
    detentsCount,
  );

  const resolvedUndimmedDetentIndex = resolveLargestUndimmedDetentIndex(
    largestUndimmedDetentIndex,
    detentsCount,
  );

  const isFitToContents = detents === 'fitToContents';

  return (
    <FormSheetHostNativeComponent
      style={styles.host}
      presentationStyle={presentationStyle}
      detents={nativeDetents}
      initialDetentIndex={resolvedInitialDetentIndex}
      largestUndimmedDetentIndex={resolvedUndimmedDetentIndex}
      preferredCornerRadius={nativeCornerRadius}
      nativeContainerBackgroundColor={
        StyleSheet.flatten(nativeContainerStyle)?.backgroundColor
      }
      {...resolveNativeBackgroundEffect(backgroundEffect)}
      {...rest}>
      {isFitToContents ? (
        <FormSheetContentWrapperNativeComponent
          style={styles.absoluteWithNoBottom}>
          {children}
        </FormSheetContentWrapperNativeComponent>
      ) : (
        children
      )}
    </FormSheetHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  // We use absolute positioning so the Host view doesn't affect the layout of its siblings.
  // Setting `top: 0` and `left: 0` explicitly anchors the view to a predictable origin,
  // preventing it from floating at an arbitrary offset based on its position in the Element tree.
  //
  // IMPORTANT: "Absolute" positioning is still relative to the nearest positioned containing
  // box. This anchors it to that specific container's (0,0), not the global window (0,0).
  host: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  absoluteWithNoBottom: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});

import React from 'react';
import { StyleSheet } from 'react-native';
import FormSheetHostNativeComponent, {
  Commands as FormSheetHostNativeCommands,
} from '../../../fabric/modals/form-sheet/FormSheetHostNativeComponent';
import FormSheetContentWrapperNativeComponent from '../../../fabric/modals/form-sheet/FormSheetContentWrapperNativeComponent';
import type { FormSheetProps } from './FormSheet.types';
import {
  resolveInitialDetentIndex,
  resolveLargestUndimmedDetentIndex,
  resolveNativeCornerRadius,
  resolveNativeDetents,
  resolveSelectedDetentIndex,
} from './FormSheetUtils';

type NativeRef = React.ComponentRef<typeof FormSheetHostNativeComponent>;

export function FormSheet(props: FormSheetProps) {
  const {
    ref,
    children,
    isOpen,
    detents,
    initialDetentIndex,
    largestUndimmedDetentIndex,
    preferredCornerRadius,
    nativeContainerStyle,
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

  const nativeRef = React.useRef<NativeRef>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      selectDetent: index => {
        const nativeIndex = resolveSelectedDetentIndex(index, detentsCount);
        if (nativeIndex === undefined) {
          return;
        }

        if (!isOpen) {
          console.warn(
            "[RNScreens] 'selectDetent' was called while the FormSheet is closed. Ignoring the call. Use 'initialDetentIndex' to choose the detent the sheet opens at.",
          );
          return;
        }

        if (!nativeRef.current) {
          console.warn(
            '[RNScreens] Reference to native FormSheet component has not been updated yet',
          );
          return;
        }

        FormSheetHostNativeCommands.selectDetent(
          nativeRef.current,
          nativeIndex,
        );
      },
    }),
    [isOpen, detentsCount],
  );

  return (
    <FormSheetHostNativeComponent
      ref={nativeRef}
      style={styles.host}
      isOpen={isOpen}
      detents={nativeDetents}
      initialDetentIndex={resolvedInitialDetentIndex}
      largestUndimmedDetentIndex={resolvedUndimmedDetentIndex}
      preferredCornerRadius={nativeCornerRadius}
      nativeContainerBackgroundColor={nativeContainerStyle?.backgroundColor}
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

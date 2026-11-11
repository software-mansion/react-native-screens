import React from 'react';
import { View } from 'react-native';
import warnOnce from 'warn-once';
import type { ContainedModalProviderProps } from './ContainedModal.types';

// The provider wraps regular, always-visible content (unlike the modal, whose
// content is hidden anyway), so the unsupported-platform stub must still
// render its children - dropping them would erase the wrapped pane.
export const ContainedModalProvider = ({
  children,
  style,
}: ContainedModalProviderProps) => {
  warnOnce(
    true,
    '[RNScreens] As of now, ContainedModal presentation is supported only on iOS; ContainedModalProvider renders its children as a plain container.',
  );
  return <View style={style}>{children}</View>;
};

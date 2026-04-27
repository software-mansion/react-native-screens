import React from 'react';
import type { InlineModalProps } from './InlineModal.types';
import InlineModalNativeComponent from '../../../fabric/gamma/inline-modal/InlineModalNativeComponent';

export function InlineModal(props: InlineModalProps) {
  return <InlineModalNativeComponent {...props} />;
}

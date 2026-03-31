import React from 'react';
import ModalNativeComponent from '../fabric/ModalNativeComponent';
import { ModalProps } from './Modal.types';
import { resolveSheetAllowedDetents } from './helpers/sheet';

export default function Modal({ sheetAllowedDetents, ...props }: ModalProps) {
  const resolvedSheetAllowedDetents = resolveSheetAllowedDetents(sheetAllowedDetents);
  return <ModalNativeComponent {...props} sheetAllowedDetents={resolvedSheetAllowedDetents} />;
}

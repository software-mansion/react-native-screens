import React from 'react';
import ModalNativeComponent from '../fabric/ModalNativeComponent';
import { ModalProps } from './Modal.types';

export default function Modal(props: ModalProps) {
  return <ModalNativeComponent {...props} />;
}

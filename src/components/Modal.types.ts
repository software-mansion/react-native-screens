import { ViewProps } from "react-native";
import type { ModalPresentation } from '../fabric/ModalNativeComponent';
import type { ScreenProps } from '../types';

export type { ModalPresentation };

export interface ModalProps {
  children: ViewProps['children'];
  style?: ViewProps['style'];
  presented?: boolean;
  presentation?: ModalPresentation;
  onDismiss?: () => void;
  sheetAllowedDetents?: ScreenProps['sheetAllowedDetents'];
}

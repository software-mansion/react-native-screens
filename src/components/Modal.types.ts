import { ViewProps } from "react-native";
import type { ModalPresentation } from '../fabric/ModalNativeComponent';

export type { ModalPresentation };

export interface ModalProps {
  children: ViewProps['children'];
  style?: ViewProps['style'];
  presented?: boolean;
  presentation?: ModalPresentation;
  onDismiss?: () => void;
}

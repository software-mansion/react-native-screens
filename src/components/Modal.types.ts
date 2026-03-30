import { ViewProps } from "react-native";

export interface ModalProps {
  children: ViewProps['children'];
  style?: ViewProps['style'];
  presented?: boolean;
  onDismiss?: () => void;
}

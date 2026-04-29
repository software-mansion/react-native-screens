import type { ViewProps } from 'react-native';

export interface InlineModalProps extends ViewProps {
  isOpen: boolean;
  onDismiss?: () => void | undefined;
}

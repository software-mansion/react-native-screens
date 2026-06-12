import type { NativeSyntheticEvent, ViewProps } from 'react-native';

export type EmptyEventPayload = Record<string, never>;

export type ComposeBottomSheetEventHandler<T> = (
  e: NativeSyntheticEvent<T>,
) => void;

export interface ComposeBottomSheetProps {
  children?: ViewProps['children'] | undefined;
  isOpen: boolean;
  onDismiss?: ComposeBottomSheetEventHandler<EmptyEventPayload> | undefined;
}

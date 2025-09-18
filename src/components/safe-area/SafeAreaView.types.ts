// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/SafeArea.types.ts
import { ViewProps } from 'react-native';

export type Edge = 'top' | 'right' | 'bottom' | 'left';

// Android-only
export type InsetType = 'all' | 'system' | 'interface';

export interface SafeAreaViewProps extends ViewProps {
  edges?: Readonly<Partial<Record<Edge, boolean>>>;
  // Android-only
  insetType?: InsetType;
}

'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type Placement =
  | 'leading'
  | 'trailing'
  | 'title'
  | 'subtitle'
  | 'largeSubtitle';

export interface NativeProps extends ViewProps {
  placement?: CT.WithDefault<Placement, 'trailing'>;
  label?: string | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderItemIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});

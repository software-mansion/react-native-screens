'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type Placement = 'left' | 'right' | 'title' | 'subtitle' | 'largeSubtitle';

export interface NativeProps extends ViewProps {
  placement?: CT.WithDefault<Placement, 'right'>;
  label?: string;
}

export default codegenNativeComponent<NativeProps>('RNSSplitHeaderItemIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});

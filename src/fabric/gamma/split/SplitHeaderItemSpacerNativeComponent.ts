'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type SpacerSize = 'fixed' | 'flexible';
type Placement = 'left' | 'right' | 'title' | 'subtitle' | 'largeSubtitle';

export interface NativeProps extends ViewProps {
  placement?: CT.WithDefault<Placement, 'right'>;
  size?: CT.WithDefault<SpacerSize, 'flexible'>;
  width?: CT.Float;
}

export default codegenNativeComponent<NativeProps>('RNSSplitHeaderItemSpacerIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});

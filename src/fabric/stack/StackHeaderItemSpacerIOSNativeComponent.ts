'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

type SpacerSize = 'fixed' | 'flexible';
type Placement = 'leading' | 'trailing';

export interface NativeProps extends ViewProps {
  placement?: CT.WithDefault<Placement, 'trailing'>;
  sizing?: CT.WithDefault<SpacerSize, 'flexible'>;
  width?: CT.Float | undefined;
}

export default codegenNativeComponent<NativeProps>(
  'RNSStackHeaderItemSpacerIOS',
  {
    excludedPlatforms: ['android'],
  },
);

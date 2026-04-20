'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

type EnvironmentChangeEvent = {
  environment: 'regular' | 'inline';
};

export interface NativeProps extends ViewProps {
  onEnvironmentChange?:
    | CT.DirectEventHandler<EnvironmentChangeEvent>
    | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSTabsBottomAccessory', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});

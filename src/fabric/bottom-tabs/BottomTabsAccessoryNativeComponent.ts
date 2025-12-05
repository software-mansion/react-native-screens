'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

type EnvironmentChangeEvent = {
  environment: 'regular' | 'inline';
};

export interface NativeProps extends ViewProps {
  onEnvironmentChange?: CT.DirectEventHandler<EnvironmentChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsAccessory', {
  interfaceOnly: true,
});

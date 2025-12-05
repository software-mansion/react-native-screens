'use client';

import { codegenNativeComponent } from 'react-native';
import type { ViewProps } from 'react-native';
import { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

type EnvironmentChangeEvent = {
  environment: 'regular' | 'inline';
};

export interface NativeProps extends ViewProps {
  onEnvironmentChange?: DirectEventHandler<EnvironmentChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsAccessory', {
  interfaceOnly: true,
});

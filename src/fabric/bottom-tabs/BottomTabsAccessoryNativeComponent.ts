'use client';

// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps } from 'react-native';
import { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

type EnvironmentChangeEvent = {
  environment: 'regular' | 'inline' | 'none';
};

export interface NativeProps extends ViewProps {
  onEnvironmentChange?: DirectEventHandler<EnvironmentChangeEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSBottomTabsAccessory', {
  interfaceOnly: true,
});

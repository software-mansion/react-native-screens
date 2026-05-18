'use client';

import type { CodegenTypes as CT, ViewProps } from 'react-native';
import { codegenNativeComponent } from 'react-native';

export interface NativeProps extends ViewProps {
  title?: string | undefined;
  subtitle?: string | undefined;
  hidden?: CT.WithDefault<boolean, false>;
  transparent?: CT.WithDefault<boolean, false>;
  backButtonHidden?: CT.WithDefault<boolean, false>;

  // iOS-specific props
  largeTitle?: string | undefined;
  largeTitleEnabled?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('RNSStackHeaderConfigIOS', {
  interfaceOnly: true,
  excludedPlatforms: ['android'],
});

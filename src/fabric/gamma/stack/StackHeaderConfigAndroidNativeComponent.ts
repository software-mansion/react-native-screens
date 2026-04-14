'use client';

import type {
  CodegenTypes as CT,
  ImageSource,
  ProcessedColorValue,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export interface NativeProps extends ViewProps {
  title?: string;
  hidden?: CT.WithDefault<boolean, false>;
  transparent?: CT.WithDefault<boolean, false>;
  backButtonHidden?: CT.WithDefault<boolean, false>;

  // Android-specific props
  type?: CT.WithDefault<StackHeaderTypeAndroid, 'small'>;

  backButtonTintColor?: ProcessedColorValue | null;
  backButtonTinting?: CT.WithDefault<boolean, true>;
  backButtonDrawableIconResourceName?: string;
  backButtonImageIconResource?: ImageSource;
}

export default codegenNativeComponent<NativeProps>(
  'RNSStackHeaderConfigAndroid',
  {
    interfaceOnly: true,
    excludedPlatforms: ['iOS'],
  },
);

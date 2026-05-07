'use client';

import type {
  ColorValue,
  CodegenTypes as CT,
  ImageSource,
  ViewProps,
} from 'react-native';
import { codegenNativeComponent } from 'react-native';

type StackHeaderTypeAndroid = 'small' | 'medium' | 'large';

export interface NativeProps extends ViewProps {
  title?: string | undefined;
  hidden?: CT.WithDefault<boolean, false>;
  transparent?: CT.WithDefault<boolean, false>;
  backButtonHidden?: CT.WithDefault<boolean, false>;

  // Android-specific props
  type?: CT.WithDefault<StackHeaderTypeAndroid, 'small'>;

  backButtonTintColor?: ColorValue | undefined;
  backButtonDrawableIconResourceName?: string | undefined;
  backButtonImageIconResource?: ImageSource | undefined;

  scrollFlagScroll?: CT.WithDefault<boolean, false>;
  scrollFlagEnterAlways?: CT.WithDefault<boolean, false>;
  scrollFlagEnterAlwaysCollapsed?: CT.WithDefault<boolean, false>;
  scrollFlagExitUntilCollapsed?: CT.WithDefault<boolean, false>;
  scrollFlagSnap?: CT.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>(
  'RNSStackHeaderConfigAndroid',
  {
    interfaceOnly: true,
    excludedPlatforms: ['iOS'],
  },
);

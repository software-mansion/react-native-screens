'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps, ColorValue } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type FinishTransitioningEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  iosPreventReattachmentOfDismissedScreens?: CT.WithDefault<boolean, true>;
  iosPreventReattachmentOfDismissedModals?: CT.WithDefault<boolean, true>;

  nativeContainerBackgroundColor?: ColorValue | undefined;

  onFinishTransitioning?:
    | CT.DirectEventHandler<FinishTransitioningEvent>
    | undefined;
}

export default codegenNativeComponent<NativeProps>('RNSScreenStack', {});

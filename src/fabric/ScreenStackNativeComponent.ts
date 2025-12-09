'use client';

import { codegenNativeComponent } from 'react-native';
import type { CodegenTypes as CT, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type FinishTransitioningEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  onFinishTransitioning?: CT.DirectEventHandler<FinishTransitioningEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSScreenStack', {});

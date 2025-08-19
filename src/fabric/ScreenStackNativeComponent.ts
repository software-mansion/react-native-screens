'use client';

import { codegenNativeComponent } from 'react-native';
import type { ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';

// eslint-disable-next-line @typescript-eslint/ban-types
type FinishTransitioningEvent = Readonly<{}>;

export interface NativeProps extends ViewProps {
  onFinishTransitioning?: DirectEventHandler<FinishTransitioningEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSScreenStack', {});

/// <reference types="react-native/types/modules/codegen" />
import type { ViewProps } from 'react-native';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
declare type FinishTransitioningEvent = Readonly<{}>;
interface NativeProps extends ViewProps {
    onFinishTransitioning?: DirectEventHandler<FinishTransitioningEvent>;
}
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;

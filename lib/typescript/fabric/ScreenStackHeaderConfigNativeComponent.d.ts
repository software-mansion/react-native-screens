/// <reference types="react-native/types/modules/codegen" />
import type { ViewProps, ColorValue } from 'react-native';
import type { Int32, WithDefault } from 'react-native/Libraries/Types/CodegenTypes';
declare type DirectionType = 'rtl' | 'ltr';
export interface NativeProps extends ViewProps {
    backgroundColor?: ColorValue;
    backTitle?: string;
    backTitleFontFamily?: string;
    backTitleFontSize?: Int32;
    backTitleVisible?: WithDefault<boolean, 'true'>;
    color?: ColorValue;
    direction?: WithDefault<DirectionType, 'ltr'>;
    hidden?: boolean;
    hideShadow?: boolean;
    largeTitle?: boolean;
    largeTitleFontFamily?: string;
    largeTitleFontSize?: Int32;
    largeTitleFontWeight?: string;
    largeTitleBackgroundColor?: ColorValue;
    largeTitleHideShadow?: boolean;
    largeTitleColor?: ColorValue;
    translucent?: boolean;
    title?: string;
    titleFontFamily?: string;
    titleFontSize?: Int32;
    titleFontWeight?: string;
    titleColor?: ColorValue;
    disableBackButtonMenu?: boolean;
    hideBackButton?: boolean;
    backButtonInCustomView?: boolean;
    topInsetEnabled?: boolean;
}
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;

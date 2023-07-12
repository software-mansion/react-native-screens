/// <reference types="react" />
/// <reference types="react-native/types/modules/codegen" />
import type { ViewProps, ColorValue, HostComponent } from 'react-native';
import type { WithDefault, BubblingEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
declare type SearchBarEvent = Readonly<{}>;
declare type SearchButtonPressedEvent = Readonly<{
    text?: string;
}>;
declare type ChangeTextEvent = Readonly<{
    text?: string;
}>;
declare type AutoCapitalizeType = 'none' | 'words' | 'sentences' | 'characters';
interface NativeProps extends ViewProps {
    onFocus?: BubblingEventHandler<SearchBarEvent> | null;
    onBlur?: BubblingEventHandler<SearchBarEvent> | null;
    onSearchButtonPress?: BubblingEventHandler<SearchButtonPressedEvent> | null;
    onCancelButtonPress?: BubblingEventHandler<SearchBarEvent> | null;
    onChangeText?: BubblingEventHandler<ChangeTextEvent> | null;
    hideWhenScrolling?: boolean;
    autoCapitalize?: WithDefault<AutoCapitalizeType, 'none'>;
    placeholder?: string;
    obscureBackground?: boolean;
    hideNavigationBar?: boolean;
    cancelButtonText?: string;
    barTintColor?: ColorValue;
    tintColor?: ColorValue;
    textColor?: ColorValue;
    disableBackButtonOverride?: boolean;
    inputType?: string;
    onClose?: BubblingEventHandler<SearchBarEvent> | null;
    onOpen?: BubblingEventHandler<SearchBarEvent> | null;
    hintTextColor?: ColorValue;
    headerIconColor?: ColorValue;
    shouldShowHintSearchIcon?: WithDefault<boolean, true>;
}
declare type ComponentType = HostComponent<NativeProps>;
interface NativeCommands {
    blur: (viewRef: React.ElementRef<ComponentType>) => void;
    focus: (viewRef: React.ElementRef<ComponentType>) => void;
    clearText: (viewRef: React.ElementRef<ComponentType>) => void;
    toggleCancelButton: (viewRef: React.ElementRef<ComponentType>, flag: boolean) => void;
    setText: (viewRef: React.ElementRef<ComponentType>, text: string) => void;
}
export declare const Commands: NativeCommands;
declare const _default: import("react-native/Libraries/Utilities/codegenNativeComponent").NativeComponentType<NativeProps>;
export default _default;

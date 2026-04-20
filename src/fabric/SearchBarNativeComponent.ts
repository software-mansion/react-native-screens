'use client';

import { codegenNativeCommands, codegenNativeComponent } from 'react-native';
import type {
  CodegenTypes as CT,
  ViewProps,
  ColorValue,
  HostComponent,
} from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
export type SearchBarEvent = Readonly<{}>;

export type SearchButtonPressedEvent = Readonly<{
  text?: string | undefined;
}>;

export type ChangeTextEvent = Readonly<{
  text?: string | undefined;
}>;

type SearchBarPlacement =
  | 'automatic'
  | 'inline' // deprecated starting from iOS 26
  | 'stacked'
  | 'integrated'
  | 'integratedButton'
  | 'integratedCentered';

type AutoCapitalizeType =
  | 'systemDefault'
  | 'none'
  | 'words'
  | 'sentences'
  | 'characters';

type OptionalBoolean = 'undefined' | 'false' | 'true';

export interface NativeProps extends ViewProps {
  onSearchFocus?: CT.DirectEventHandler<SearchBarEvent> | null | undefined;
  onSearchBlur?: CT.DirectEventHandler<SearchBarEvent> | null | undefined;
  onSearchButtonPress?:
    | CT.DirectEventHandler<SearchButtonPressedEvent>
    | null
    | undefined;
  onCancelButtonPress?:
    | CT.DirectEventHandler<SearchBarEvent>
    | null
    | undefined;
  onChangeText?: CT.DirectEventHandler<ChangeTextEvent> | null | undefined;
  hideWhenScrolling?: CT.WithDefault<boolean, true>;
  autoCapitalize?: CT.WithDefault<AutoCapitalizeType, 'systemDefault'>;
  placeholder?: string | undefined;
  placement?: CT.WithDefault<SearchBarPlacement, 'automatic'>;
  allowToolbarIntegration?: CT.WithDefault<boolean, true>;
  obscureBackground?: CT.WithDefault<OptionalBoolean, 'undefined'>;
  hideNavigationBar?: CT.WithDefault<OptionalBoolean, 'undefined'>;
  cancelButtonText?: string | undefined;
  // TODO: implement these on iOS
  barTintColor?: ColorValue | undefined;
  tintColor?: ColorValue | undefined;
  textColor?: ColorValue | undefined;

  // Android only
  autoFocus?: CT.WithDefault<boolean, false>;
  disableBackButtonOverride?: boolean | undefined;
  // TODO: consider creating enum here
  inputType?: string | undefined;
  onClose?: CT.DirectEventHandler<SearchBarEvent> | null | undefined;
  onOpen?: CT.DirectEventHandler<SearchBarEvent> | null | undefined;
  hintTextColor?: ColorValue | undefined;
  headerIconColor?: ColorValue | undefined;
  shouldShowHintSearchIcon?: CT.WithDefault<boolean, true>;
}

type ComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  blur: (viewRef: React.ElementRef<ComponentType>) => void;
  focus: (viewRef: React.ElementRef<ComponentType>) => void;
  clearText: (viewRef: React.ElementRef<ComponentType>) => void;
  toggleCancelButton: (
    viewRef: React.ElementRef<ComponentType>,
    flag: boolean,
  ) => void;
  setText: (viewRef: React.ElementRef<ComponentType>, text: string) => void;
  cancelSearch: (viewRef: React.ElementRef<ComponentType>) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: [
    'blur',
    'focus',
    'clearText',
    'toggleCancelButton',
    'setText',
    'cancelSearch',
  ],
});

export default codegenNativeComponent<NativeProps>('RNSSearchBar', {});

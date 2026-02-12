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
  text?: string;
}>;

export type ChangeTextEvent = Readonly<{
  text?: string;
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
  onSearchFocus?: CT.DirectEventHandler<SearchBarEvent> | null;
  onSearchBlur?: CT.DirectEventHandler<SearchBarEvent> | null;
  onSearchButtonPress?: CT.DirectEventHandler<SearchButtonPressedEvent> | null;
  onCancelButtonPress?: CT.DirectEventHandler<SearchBarEvent> | null;
  onChangeText?: CT.DirectEventHandler<ChangeTextEvent> | null;
  hideWhenScrolling?: CT.WithDefault<boolean, true>;
  autoCapitalize?: CT.WithDefault<AutoCapitalizeType, 'systemDefault'>;
  placeholder?: string;
  placement?: CT.WithDefault<SearchBarPlacement, 'automatic'>;
  allowToolbarIntegration?: CT.WithDefault<boolean, true>;
  obscureBackground?: CT.WithDefault<OptionalBoolean, 'undefined'>;
  hideNavigationBar?: CT.WithDefault<OptionalBoolean, 'undefined'>;
  cancelButtonText?: string;
  // TODO: implement these on iOS
  barTintColor?: ColorValue;
  tintColor?: ColorValue;
  textColor?: ColorValue;

  // Android only
  autoFocus?: CT.WithDefault<boolean, false>;
  disableBackButtonOverride?: boolean;
  // TODO: consider creating enum here
  inputType?: string;
  onClose?: CT.DirectEventHandler<SearchBarEvent> | null;
  onOpen?: CT.DirectEventHandler<SearchBarEvent> | null;
  hintTextColor?: ColorValue;
  headerIconColor?: ColorValue;
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

/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, ColorValue, HostComponent } from 'react-native';
import type {
  WithDefault,
  BubblingEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';

type SearchBarEvent = Readonly<{}>;

type SearchButtonPressedEvent = Readonly<{
  text?: string;
}>;

type ChangeTextEvent = Readonly<{
  text?: string;
}>;

type SearchBarPlacement = 'automatic' | 'inline' | 'stacked';

type AutoCapitalizeType = 'none' | 'words' | 'sentences' | 'characters';

interface NativeProps extends ViewProps {
  onFocus?: BubblingEventHandler<SearchBarEvent> | null;
  onBlur?: BubblingEventHandler<SearchBarEvent> | null;
  onSearchButtonPress?: BubblingEventHandler<SearchButtonPressedEvent> | null;
  onCancelButtonPress?: BubblingEventHandler<SearchBarEvent> | null;
  onChangeText?: BubblingEventHandler<ChangeTextEvent> | null;
  hideWhenScrolling?: boolean;
  autoCapitalize?: WithDefault<AutoCapitalizeType, 'none'>;
  placeholder?: string;
  placement?: WithDefault<SearchBarPlacement, 'stacked'>;
  obscureBackground?: boolean;
  hideNavigationBar?: boolean;
  cancelButtonText?: string;
  // TODO: implement these on iOS
  barTintColor?: ColorValue;
  tintColor?: ColorValue;
  textColor?: ColorValue;

  // Android only
  disableBackButtonOverride?: boolean;
  // TODO: consider creating enum here
  inputType?: string;
  onClose?: BubblingEventHandler<SearchBarEvent> | null;
  onOpen?: BubblingEventHandler<SearchBarEvent> | null;
  hintTextColor?: ColorValue;
  headerIconColor?: ColorValue;
  shouldShowHintSearchIcon?: WithDefault<boolean, true>;
}

type ComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  blur: (viewRef: React.ElementRef<ComponentType>) => void;
  focus: (viewRef: React.ElementRef<ComponentType>) => void;
  clearText: (viewRef: React.ElementRef<ComponentType>) => void;
  toggleCancelButton: (
    viewRef: React.ElementRef<ComponentType>,
    flag: boolean
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

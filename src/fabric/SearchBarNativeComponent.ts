/* eslint-disable */
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { ViewProps, ColorValue } from 'react-native';
import type {
  WithDefault,
  BubblingEventHandler,
} from 'react-native/Libraries/Types/CodegenTypes';

type SearchBarEvent = Readonly<{}>;

type SearchButtonPressedEvent = Readonly<{
  text?: string;
}>;

type ChangeTextEvent = Readonly<{
  text?: string;
}>;

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

export default codegenNativeComponent<NativeProps>('RNSSearchBar', {});

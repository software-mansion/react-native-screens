import {
  codegenNativeComponent,
  type ColorValue,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeBarItemProps extends ViewProps {
  title?: string;
  icon?: string;
  placement?: string;
  variant?: string;
  tintColor?: ColorValue;
  width?: CodegenTypes.Double;
  disabled?: boolean;
  selected?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  testID?: string;
  titleFontFamily?: string;
  titleFontSize?: CodegenTypes.Double;
  titleFontWeight?: string;
  titleColor?: ColorValue;
  identifier?: string;
  hidesSharedBackground?: boolean;
  sharesBackground?: boolean;
  hasSharesBackground?: boolean;
  badgeCount?: CodegenTypes.Int32;
  badgeValue?: string;
  badgeForegroundColor?: ColorValue;
  badgeBackgroundColor?: ColorValue;
  badgeFontFamily?: string;
  badgeFontSize?: CodegenTypes.Double;
  badgeFontWeight?: string;
  hasBadge?: boolean;
  // TODO: something in the event type
  // eslint-disable-next-line @typescript-eslint/ban-types
  onItemPress?: CodegenTypes.DirectEventHandler<{}>;
}

export default codegenNativeComponent<NativeBarItemProps>('RNSBarItem');

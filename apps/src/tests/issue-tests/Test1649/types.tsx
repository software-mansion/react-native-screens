import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type StackParamList = {
  First: undefined;
  Second: undefined;
  PushWithScrollView: undefined;
  SheetScreen: undefined;
  SheetScreenWithScrollView: undefined;
  SheetWithScrollView: undefined;
  SheetWithTextInput: undefined;
  Third: undefined;
  NestedStack: undefined;
  ModalScreen: undefined;
  AnotherSheetScreen: undefined;
};

export type NavProp<
  RouteName extends keyof StackParamList = keyof StackParamList,
> = NativeStackNavigationProp<StackParamList, RouteName>;

export type NavPropObj<
  RouteName extends keyof StackParamList = keyof StackParamList,
> = {
  navigation: NavProp<RouteName>;
};

export type AllowedDetentsType = NonNullable<
  NativeStackNavigationOptions['sheetAllowedDetents']
>;

export type SheetOptions = {
  sheetAllowedDetents?: AllowedDetentsType;
  sheetLargestUndimmedDetentIndex?: NativeStackNavigationOptions['sheetLargestUndimmedDetentIndex'];
  sheetElevation?: NativeStackNavigationOptions['sheetElevation'];
  sheetExpandsWhenScrolledToEdge?: NativeStackNavigationOptions['sheetExpandsWhenScrolledToEdge'];
  sheetCornerRadius?: NativeStackNavigationOptions['sheetCornerRadius'];
  sheetGrabberVisible?: NativeStackNavigationOptions['sheetGrabberVisible'];
  sheetInitialDetentIndex?: NativeStackNavigationOptions['sheetInitialDetentIndex'];
  // @ts-expect-error this prop is available with yet unreleased react navigation version
  // see this PR: https://github.com/react-navigation/react-navigation/pull/12032
  onSheetDetentChanged?: NativeStackNavigationOptions['onSheetDetentChanged'];
};

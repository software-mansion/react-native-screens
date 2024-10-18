import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type NavProp = NativeStackNavigationProp<ParamListBase>;

export type NavPropObj = {
  navigation: NavProp;
};

export type AllowedDetentsType = NativeStackNavigationOptions['sheetAllowedDetents'];

export type SheetOptions = {
  sheetAllowedDetents?: AllowedDetentsType,
  sheetLargestUndimmedDetent?: NativeStackNavigationOptions['sheetLargestUndimmedDetent'],
  sheetElevation?: NativeStackNavigationOptions['sheetElevation'],
  sheetExpandsWhenScrolledToEdge?: NativeStackNavigationOptions['sheetExpandsWhenScrolledToEdge'],
  sheetCornerRadius?: NativeStackNavigationOptions['sheetCornerRadius'],
  sheetGrabberVisible?: NativeStackNavigationOptions['sheetGrabberVisible'],
  sheetInitialDetent?: NativeStackNavigationOptions['sheetInitialDetent'],
  // @ts-expect-error this prop is available with yet unreleased react navigation version
  // see this PR: https://github.com/react-navigation/react-navigation/pull/12032
  onSheetDetentChanged?: NativeStackNavigationOptions['onSheetDetentChanged'];
}


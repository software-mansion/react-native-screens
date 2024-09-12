import * as React from 'react';
import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
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
  onSheetDetentChanged?: NativeStackNavigationOptions['onSheetDetentChanged'];
}


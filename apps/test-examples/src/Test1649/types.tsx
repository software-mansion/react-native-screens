import * as React from 'react';
import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';

export type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export type AllowedDetentsType = NativeStackNavigationOptions['sheetAllowedDetents'];

export type ScreenComponent = {
  name: string,
  Component: React.ReactNode,
  options: NativeStackScreenProps<ParamListBase>,
};


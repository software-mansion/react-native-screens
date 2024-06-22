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


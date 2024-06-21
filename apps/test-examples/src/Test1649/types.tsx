import { ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

export type NavProp = {
  navigation: NativeStackNavigationProp<ParamListBase>;
};

export type AllowedDetentsType = NativeStackNavigationOptions['sheetAllowedDetents'];



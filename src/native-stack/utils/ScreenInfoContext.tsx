import * as React from 'react';
import { NativeStackDescriptor, NativeStackNavigationRoute } from '../types';
import { ParamListBase } from '@react-navigation/native';

export type ScreenInfoType = {
  descriptor: NativeStackDescriptor | undefined;
  route: NativeStackNavigationRoute<ParamListBase, string> | undefined;
  screenIndex: number;
};

const ScreenInfoContext = React.createContext<ScreenInfoType>({
  descriptor: undefined,
  route: undefined,
  screenIndex: -1,
});

export default ScreenInfoContext;

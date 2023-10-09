import * as React from 'react';
import { NativeStackNavigationOptions } from '../types';

type ScreenInfoType = {
  options: NativeStackNavigationOptions;
};

const ScreenInfoContext = React.createContext<ScreenInfoType>({
  options: {},
});

export default ScreenInfoContext;

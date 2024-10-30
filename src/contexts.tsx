import React, { PropsWithChildren } from 'react';
import { GestureProviderProps } from './types';

export const GHContext = React.createContext(
  (props: PropsWithChildren<GestureProviderProps>) => <>{props.children}</>,
);

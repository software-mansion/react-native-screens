import React, { PropsWithChildren } from 'react';
import { GestureProviderProps, ScreensRefsHolder } from './types';

export const GHContext = React.createContext(
  (props: PropsWithChildren<GestureProviderProps>) => <>{props.children}</>,
);

export const RNSScreensRefContext =
  React.createContext<React.MutableRefObject<ScreensRefsHolder> | null>(null);

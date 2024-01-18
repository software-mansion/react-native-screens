import React from 'react';
import { GestureProviderProps } from '../../native-stack/types';

// context to be used when the user wants full screen swipe (see `gesture-handler` folder in repo)
export const GHContext = React.createContext(
  (
    _props: GestureProviderProps,
    { children }: { children: React.ReactNode }
  ) => <>{children}</>
);

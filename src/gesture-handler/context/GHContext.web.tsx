import React from 'react';
import { GestureProviderProps } from '../../native-stack/types';

export const GHContext = React.createContext(
  (_props: GestureProviderProps): React.ReactElement => <></>
);

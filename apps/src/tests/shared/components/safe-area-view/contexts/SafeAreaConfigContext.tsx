import React, { type Dispatch, type SetStateAction } from 'react';
import { SafeAreaViewProps } from 'react-native-screens/experimental';

export type SafeAreaConfigContextPayload = {
  props: SafeAreaViewProps;
  mutations: {
    toggleLeft: Dispatch<SetStateAction<boolean>>;
    toggleTop: Dispatch<SetStateAction<boolean>>;
    toggleRight: Dispatch<SetStateAction<boolean>>;
    toggleBottom: Dispatch<SetStateAction<boolean>>;
  }
};

export const SafeAreaConfigContext = React.createContext<SafeAreaConfigContextPayload | null>(null);


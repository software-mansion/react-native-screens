import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { SearchBarPlacement } from 'react-native-screens';
import { SAVExampleConfig } from '../shared/SAVExampleConfig';

export interface StackV4SAVExampleConfig extends SAVExampleConfig {
  headerTransparent: boolean;
  headerLargeTitle: boolean;
  headerShown: boolean;
  headerSearchBar: 'disabled' | SearchBarPlacement;
}

export interface StackV4SAVExampleContextInterface {
  config: StackV4SAVExampleConfig;
  setConfig: Dispatch<SetStateAction<StackV4SAVExampleConfig>>;
}

export const StackV4SAVExampleContext =
  createContext<StackV4SAVExampleContextInterface | null>(null);

export const useStackV4SAVExampleContext = () => {
  const ctx = useContext(StackV4SAVExampleContext);

  if (!ctx) {
    throw new Error(
      'useStackV4SAVExampleContext has to be used within <StackV4SAVExampleContext.Provider>',
    );
  }

  return ctx;
};

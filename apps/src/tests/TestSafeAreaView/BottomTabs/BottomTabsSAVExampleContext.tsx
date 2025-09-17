import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { SAVExampleConfig } from '../shared/SAVExampleConfig';
import {
  BottomTabsSystemItem,
  TabBarMinimizeBehavior,
} from 'react-native-screens';

export interface BottomTabsSAVExampleConfig extends SAVExampleConfig {
  tabBarMinimizeBehavior: TabBarMinimizeBehavior;
  tabBarItemSystemItem: 'disabled' | BottomTabsSystemItem;
}

export interface BottomTabsSAVExampleContextInterface {
  config: BottomTabsSAVExampleConfig;
  setConfig: Dispatch<SetStateAction<BottomTabsSAVExampleConfig>>;
}

export const BottomTabsSAVExampleContext =
  createContext<BottomTabsSAVExampleContextInterface | null>(null);

export const useBottomTabsSAVExampleContext = () => {
  const ctx = useContext(BottomTabsSAVExampleContext);

  if (!ctx) {
    throw new Error(
      'useBottomTabsSAVExampleContext has to be used within <BottomTabsSAVExampleContext.Provider>',
    );
  }

  return ctx;
};

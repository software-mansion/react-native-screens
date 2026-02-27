import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import {
  type TabsSystemItemIOS,
  TabBarMinimizeBehaviorIOS,
} from 'react-native-screens';
import { ContentType } from '../shared';

export interface BottomTabsSAVExampleConfig {
  tabBarMinimizeBehavior: TabBarMinimizeBehaviorIOS;
  tabBarItemSystemItem: 'disabled' | TabsSystemItemIOS;

  safeAreaTopEdge: boolean;
  safeAreaBottomEdge: boolean;
  safeAreaLeftEdge: boolean;
  safeAreaRightEdge: boolean;

  content: Exclude<ContentType, 'scrollViewNever'>;
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

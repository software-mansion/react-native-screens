import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import type {
  TabsScreenSystemItem,
  TabBarMinimizeBehavior,
} from 'react-native-screens';
import { ContentType } from '../shared';

export interface TabsSAVExampleConfig {
  tabBarMinimizeBehavior: TabBarMinimizeBehavior;
  tabBarItemSystemItem: 'disabled' | TabsScreenSystemItem;

  safeAreaTopEdge: boolean;
  safeAreaBottomEdge: boolean;
  safeAreaLeftEdge: boolean;
  safeAreaRightEdge: boolean;

  content: Exclude<ContentType, 'scrollViewNever'>;
}

export interface TabsSAVExampleContextInterface {
  config: TabsSAVExampleConfig;
  setConfig: Dispatch<SetStateAction<TabsSAVExampleConfig>>;
}

export const TabsSAVExampleContext =
  createContext<TabsSAVExampleContextInterface | null>(null);

export const useTabsSAVExampleContext = () => {
  const ctx = useContext(TabsSAVExampleContext);

  if (!ctx) {
    throw new Error(
      'useTabsSAVExampleContext has to be used within <TabsSAVExampleContext.Provider>',
    );
  }

  return ctx;
};

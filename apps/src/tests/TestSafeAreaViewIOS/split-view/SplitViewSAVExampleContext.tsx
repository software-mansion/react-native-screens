import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { ContentType } from '../shared';

export interface ColumnConfig {
  safeAreaTopEdge: boolean;
  safeAreaBottomEdge: boolean;
  safeAreaLeftEdge: boolean;
  safeAreaRightEdge: boolean;
  content: ContentType;
}

export interface SplitViewSAVExampleConfig {
  column1: ColumnConfig;
  column2: ColumnConfig;
  column3: ColumnConfig;
  column4: ColumnConfig;
  showInspector: boolean;
}

export interface SplitViewSAVExampleContextInterface {
  config: SplitViewSAVExampleConfig;
  setConfig: Dispatch<SetStateAction<SplitViewSAVExampleConfig>>;
}

export const SplitViewSAVExampleContext =
  createContext<SplitViewSAVExampleContextInterface | null>(null);

export const useSplitViewSAVExampleContext = () => {
  const ctx = useContext(SplitViewSAVExampleContext);

  if (!ctx) {
    throw new Error(
      'useSplitViewSAVExampleContext has to be used within <SplitViewSAVExampleContext.Provider>',
    );
  }

  return ctx;
};

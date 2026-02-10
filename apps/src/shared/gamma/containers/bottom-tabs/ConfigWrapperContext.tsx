import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { featureFlags } from 'react-native-screens';

export const DEFAULT_GLOBAL_CONFIGURATION = {
  heavyTabRender: false,
  controlledBottomTabs: featureFlags.experiment.controlledBottomTabs,
} as const;

export interface Configuration {
  heavyTabRender: boolean;
  controlledBottomTabs: boolean;
}

export interface ConfigWrapper {
  config: Configuration;
  setConfig?: Dispatch<SetStateAction<Configuration>>;
}

const ConfigWrapperContext = React.createContext<ConfigWrapper>({
  config: DEFAULT_GLOBAL_CONFIGURATION,
});

export default ConfigWrapperContext;

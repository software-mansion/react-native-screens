import React from 'react';
import type { Dispatch, SetStateAction } from 'react';

export const DEFAULT_GLOBAL_CONFIGURATION = {
  heavyTabRender: false,
} as const;

export interface Configuration {
  heavyTabRender: boolean;
}

export interface ConfigWrapper {
  config: Configuration;
  setConfig?: Dispatch<SetStateAction<Configuration>>;
}

const ConfigWrapperContext = React.createContext<ConfigWrapper>({
  config: DEFAULT_GLOBAL_CONFIGURATION,
});

export default ConfigWrapperContext;

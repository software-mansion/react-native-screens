import React from 'react';
import { ViewProps } from 'react-native';
import { StackConfigUpdate, StackScreenConfig } from '../../stack-config.types';
import {
  StackConfigContext,
  StackConfigDispatchContext,
} from '../../contexts/stack-config';

export function StackConfigProvider(props: {
  children: ViewProps['children'];
  screens: Record<string, React.ComponentType>;
}) {
  const [config, dispatch] = React.useReducer(
    reduce,
    makeInitialConfig(props.screens),
  );

  return (
    <StackConfigContext.Provider value={config}>
      <StackConfigDispatchContext.Provider value={dispatch}>
        {props.children}
      </StackConfigDispatchContext.Provider>
    </StackConfigContext.Provider>
  );
}

function reduce(
  config: StackScreenConfig<any>[],
  action: StackConfigUpdate<any>,
) {
  switch (action.type) {
    case 'screen':
      const index = config.findIndex(c => c.name === action.name);
      if (index >= 0) {
        config[index] = {
          ...config[index],
          options: {
            ...config[index].options,
            ...action.config,
          },
        };
        config = [...config];
      }
      break;
  }

  return config;
}

function makeInitialConfig(
  screens: Record<string, React.ComponentType>,
): StackScreenConfig<any>[] {
  return Object.entries(screens).map(([k, C]) => ({
    name: k,
    component: C,
    options: { title: k },
  }));
}

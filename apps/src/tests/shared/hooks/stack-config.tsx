import React, { Dispatch } from 'react';
import { KeyList } from '../helpers';
import type {
  StackConfigUpdate,
  StackScreenConfig,
} from '../stack-config.types';
import {
  StackConfigContext,
  StackConfigDispatchContext,
} from '../contexts/stack-config';

/**
 * Configuration for the Stack.
 * Use within the Provider returned by createStackConfig.
 * Template parameter with available Screen names is required.
 */
export function useStackConfig<
  S extends KeyList = {},
>(): StackScreenConfig<S>[] {
  const config = React.useContext(StackConfigContext);

  if (!config) {
    throw new Error(
      'useStackConfig must be used within a StackConfigContext.Provider',
    );
  }

  return config as StackScreenConfig<S>[];
}

/**
 * Dispatcher for useReducer pattern for Stack configuration.
 * Use within the Provider returned by createStackConfig.
 * Template parameter with available Screen names is required.
 */
export function useDispatchStackConfig<S extends KeyList = {}>(): Dispatch<
  StackConfigUpdate<S>
> {
  const dispatch = React.useContext(StackConfigDispatchContext);

  if (!dispatch) {
    throw new Error(
      'useDispatchStackConfig must be used within a StackConfigDispatchContext.Provider',
    );
  }

  return dispatch;
}

import React, { ReactNode } from 'react';
import type { StackScreenConfig } from './stack-config.types';
import { KeyList } from './helpers';
import { StackConfigProvider } from './components/stack/StackConfigProvider';
import { StackAutoconfig } from './components/stack/StackAutoconfig';

/**
 * Creates a Provider and Autoconfig component for easy Stack configuration.
 * Template parameter with available Screen names is required.
 */
export function createAutoConfiguredStack<S extends KeyList = {}>(
  screens: {} extends S
    ? never
    : Record<Extract<keyof S, string>, React.ComponentType>,
) {
  return {
    Provider: (props: { children: ReactNode | ReactNode[] }) => (
      <StackConfigProvider screens={screens}>
        {props.children}
      </StackConfigProvider>
    ),
    Autoconfig: StackAutoconfig,
  };
}

export function findStackScreenOptions<S extends KeyList>(
  config: StackScreenConfig<S>[],
  key: Extract<keyof S, string>,
): StackScreenConfig<S>['options'] | undefined {
  return config.find(c => c.name === key)?.options;
}
